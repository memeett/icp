import requests
import json
import math
import time
import re
from collections import Counter, defaultdict
from typing import List, Dict, Any
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    StartSessionContent,
)
from uagents import Agent, Context, Protocol, Model
from datetime import datetime, timezone
from uuid import uuid4

# NOTE: mengikuti pola agent.py: gunakan ASI1 + tools; backend hanya sebagai data source via /getAllJobs

ASI1_API_KEY = "sk_e6ca5699fe394c2ea28f700c1a1eac6de6f7e4f8a5fd404d97c625a387f3df1e"  # sama pola dengan agent.py (hardcoded)
ASI1_BASE_URL = "https://api.asi1.ai/v1"
ASI1_HEADERS = {
    "Authorization": f"Bearer {ASI1_API_KEY}",
    "Content-Type": "application/json"
}

# ICP HTTP routing
JOB_CANISTER_ID = "ufxgi-4p777-77774-qaadq-cai"
USER_CANISTER_ID = "vt46d-j7777-77774-qaagq-cai"
RATING_CANISTER_ID = "vg3po-ix777-77774-qaafa-cai"

BASE_URL = "http://127.0.0.1:4943"
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

def with_host(headers: dict, canister_id: str) -> dict:
    return {**headers, "Host": f"{canister_id}.localhost"}

# Cache ringan untuk jobs agar beberapa tools tidak memanggil canister berulang dalam satu sesi
_JOBS_CACHE: Dict[str, Any] = {"data": None, "ts": 0.0}
# BAGIAN 1: Cache untuk users, polanya sama seperti _JOBS_CACHE
_USERS_CACHE: Dict[str, Any] = {"data": None, "ts": 0.0}
_RATINGS_CACHE: Dict[str, Any] = {"data": None, "ts": 0.0}
_CACHE_TTL = 60.0  # detik

# --------------------------
# REST API Models
# --------------------------
class ChatRequest(Model):
    message: str

class ChatResponse(Model):
    response: str
    timestamp: str
    status: str

class HealthResponse(Model):
    status: str
    agent_name: str
    agent_address: str
    port: int

class JobsResponse(Model):
    jobs: List[Dict[str, Any]]
    count: int
    timestamp: str
    status: str

# --------------------------
# Tools (function calling)
# --------------------------
# Semua tools hanya membaca data dari getAllJobs

tools = [
    {
        "type": "function",
        "function": {
            "name": "getAllJobs",
            "description": "Ambil semua job dari platform (via ICP HTTP).",
            "parameters": {"type": "object", "properties": {}, "required": []},
            "strict": True,
        },
    },
    {
        "type": "function",
        "function": {
            "name": "recommend_jobs_by_skills",
            "description": "Rekomendasikan job berdasarkan daftar skill freelancer (cosine similarity TF-IDF sederhana).",
            "parameters": {
                "type": "object",
                "properties": {
                    "skills": {"type": "array", "items": {"type": "string"}},
                    "top_n": {"type": "integer", "default": 5, "minimum": 1, "maximum": 20},
                },
                "required": ["skills"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    },
    {
        "type": "function",
        "function": {
            "name": "budget_advice",
            "description": "Sarankan rentang budget realistis berdasarkan scope/keywords dan (opsional) tags/slots.",
            "parameters": {
                "type": "object",
                "properties": {
                    "scope": {"type": "string", "description": "Deskripsi singkat scope pekerjaan."},
                    "tags": {"type": "array", "items": {"type": "string"}},
                    "slots": {"type": "integer", "minimum": 1},
                },
                "required": ["scope"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    },
{
    "type": "function",
    "function": {
        "name": "getAllUsers",
        "description": "Mengambil dan menampilkan daftar lengkap semua pengguna (users) yang terdaftar di platform. Gunakan fungsi ini jika diminta untuk 'list semua user', 'tampilkan pengguna', 'berikan data user', atau permintaan sejenisnya.",
        
        "parameters": {"type": "object", "properties": {}, "required": []},
        "strict": True,
    },
},
{
    "type": "function",
    "function": {
        "name": "jobRecommendation",
        "description": "Memberikan rekomendasi pekerjaan kepada user sesuai dengan user preferences",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "strict": True
    }
},


{
    "type": "function",
    "function": {
        "name": "find_talent",
        "description": "Rekomendasikan freelancer terbaik berdasarkan kategori pekerjaan (job tags). Gunakan fungsi ini jika user meminta untuk 'mencari talenta', 'menemukan freelancer', atau 'merekomendasikan kandidat' untuk bidang tertentu seperti 'Web Development' atau 'UI/UX Design'.",
        "parameters": {
            "type": "object",
            "properties": {
                "job_tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Daftar kategori (tags) pekerjaan untuk menemukan talenta yang cocok."
                },
                "top_n": {
                    "type": "integer",
                    "default": 3,
                    "minimum": 1,
                    "maximum": 10
                },
            },
            "required": ["job_tags"],
            "additionalProperties": False,
        },
        "strict": True,
    },
},
{
    "type": "function",
    "function": {
        "name": "proposal_template",
        "description": "Membuat template proposal yang dipersonalisasi untuk sebuah pekerjaan (job).",
        "parameters": {
            "type": "object",
            "properties": {
                "job_id": {"type": "string", "description": "ID dari pekerjaan yang akan dibuatkan proposal."},
                "profile": {
                    "type": "object",
                    "description": "Profil singkat freelancer (nama, skills, pencapaian).",
                    "properties": {
                        "name": {"type": "string"},
                        "skills": {"type": "array", "items": {"type": "string"}},
                        "achievements": {"type": "array", "items": {"type": "string"}},
                    },
                },
            },
            "required": ["job_id", "profile"],
        },
        "strict": True,
    },
}

]

# --------------------------
# Helper: fetch data via ICP HTTP
# --------------------------

async def _fetch_canister_data(ctx: Context, cache: Dict, endpoint: str, canister_id: str) -> List[Dict]:
    now = time.time()
    if cache["data"] is not None and (now - cache["ts"]) < _CACHE_TTL:
        return cache["data"]

    errors = []
    headers_with_host = with_host(HEADERS, canister_id)
    url = f"{BASE_URL}/{endpoint}"

    # Explicitly log headers to ensure visibility
    ctx.logger.error(f"DEBUG_HEADERS: Attempting to fetch from {endpoint} at URL: {url} with headers: {headers_with_host}")

    # Coba POST dulu karena beberapa query butuh body
    try:
        ctx.logger.debug(f"Trying POST request to {url}")
        resp = requests.post(url, headers=headers_with_host, json={}, timeout=15)
        resp.raise_for_status()
        
        # Log the raw response content for debugging
        ctx.logger.debug(f"Raw response from POST to {endpoint}: {resp.text}")
        
        data = resp.json()
        if isinstance(data, list):
            ctx.logger.debug(f"Successfully fetched data via POST from {endpoint}. Data length: {len(data)}")
            cache["data"] = data
            cache["ts"] = time.time()
            return data
    except requests.exceptions.RequestException as e:
        errors.append(f"POST to {endpoint} failed: {e}")
        ctx.logger.warning(f"POST request to {url} failed: {e}")
    except json.JSONDecodeError as e:
        errors.append(f"Failed to decode JSON from POST to {endpoint}: {e}")
        ctx.logger.error(f"Failed to decode JSON from POST to {url}. Response text: {resp.text}", exc_info=True)
    except Exception as e:
        errors.append(f"POST to {endpoint} failed: {e}")
        ctx.logger.error(f"Unexpected error during POST to {url}: {e}", exc_info=True)

    # Fallback ke GET
    try:
        ctx.logger.debug(f"Trying GET request to {url}")
        resp = requests.get(url, headers=headers_with_host, timeout=10)
        resp.raise_for_status()
        
        # Log the raw response content for debugging
        ctx.logger.debug(f"Raw response from GET to {endpoint}: {resp.text}")
        
        data = resp.json()
        if isinstance(data, list):
            cache["data"] = data
            cache["ts"] = time.time()
            return data
    except requests.exceptions.RequestException as e:
        errors.append(f"GET to {endpoint} failed: {e}")
        ctx.logger.warning(f"GET request to {url} failed: {e}")
    except json.JSONDecodeError as e:
        errors.append(f"Failed to decode JSON from GET to {endpoint}: {e}")
        ctx.logger.error(f"Failed to decode JSON from GET to {url}. Response text: {resp.text}", exc_info=True)
    except Exception as e:
        errors.append(f"GET to {endpoint} failed: {e}")
        ctx.logger.error(f"Unexpected error during GET to {url}: {e}", exc_info=True)

    raise RuntimeError(f"Failed to fetch from {endpoint}: " + " | ".join(errors))

async def fetch_jobs(ctx: Context) -> List[Dict[str, Any]]:
    return await _fetch_canister_data(ctx, _JOBS_CACHE, "getAllJobs", JOB_CANISTER_ID)

# BAGIAN 3: Fungsi fetch untuk users, sama seperti fetch_jobs
async def fetch_users(ctx: Context) -> List[Dict[str, Any]]:
    # Asumsi canister User punya endpoint /getAllUsers
    return await _fetch_canister_data(ctx, _USERS_CACHE, "getAllUsers", USER_CANISTER_ID)

# --------------------------
# TF-IDF logic has been removed as requested.

# --------------------------
# Tool handlers (local compute)
# --------------------------

async def tool_getAllJobs(ctx: Context, args: Dict[str, Any]):
    jobs = await fetch_jobs(ctx)
    return jobs

# BAGIAN 4: Handler untuk tool 'getAllUsers', sama seperti 'tool_getAllJobs'
async def tool_getAllUsers(ctx: Context, args: Dict[str, Any]):
    users = await fetch_users(ctx)
    return users

async def tool_recommend_jobs_by_skills(ctx: Context, args: Dict[str, Any]):
    skills: List[str] = args.get("skills", [])
    top_n: int = int(args.get("top_n", 5))
    jobs = await fetch_jobs(ctx)

    # Build corpus
    docs = [build_doc(j) for j in jobs]
    tokens_list = [tokenize(d) for d in docs]
    idf_map = compute_idf(tokens_list + [tokenize(" ".join(skills))])
    job_vecs = [vec(tf(toks), idf_map) for toks in tokens_list]

    # Query vector from skills
    q_tokens = tokenize(" ".join(skills))
    q_vec = vec(tf(q_tokens), idf_map)

    scored = []
    for j, v in zip(jobs, job_vecs):
        score = cosine(q_vec, v)
        scored.append({"job": j, "score": round(float(score), 4)})

    scored.sort(key=lambda x: x["scores"]["final"], reverse=True)
    return scored[:top_n]

async def tool_budget_advice(ctx: Context, args: Dict[str, Any]):
    scope: str = args.get("scope", "")
    tags: List[str] = args.get("tags", [])
    slots = args.get("slots", None)
    jobs = await fetch_jobs(ctx)

    # Filter comparables
    def has_overlap(job):
        if not tags:
            return True
        job_tags = {t.get("jobCategoryName", "").lower() for t in (job.get("jobTags", []) or [])}
        return any(tag.lower() in job_tags for tag in tags)

    comps = [j for j in jobs if has_overlap(j)] or jobs

    salaries = [float(j.get("jobSalary", 0.0)) for j in comps if isinstance(j.get("jobSalary", None), (int, float))]
    salaries = [s for s in salaries if s > 0]
    if not salaries:
        return {"advice": None, "reason": "No comparable salaries found"}

    salaries.sort()
    n = len(salaries)
    median = salaries[n // 2] if n % 2 == 1 else 0.5 * (salaries[n // 2 - 1] + salaries[n // 2])
    q1 = salaries[n // 4]
    q3 = salaries[(3 * n) // 4]
    iqr = max(q3 - q1, 1.0)

    # base range
    low = max(0.0, median - 0.5 * iqr)
    high = median + 0.5 * iqr

    # complexity factor from scope keywords
    scope_tokens = set(tokenize(scope))
    heavy = {"integration", "optimization", "scalable", "realtime", "security", "ml", "ai", "distributed"}
    light = {"bugfix", "minor", "landing", "static", "copywriting"}

    factor = 1.0
    if scope_tokens & heavy:
        factor *= 1.2
    if scope_tokens & light:
        factor *= 0.9
    
    # slots adjustment (linear)
    if isinstance(slots, int) and slots > 0:
        avg_slots = sum(int(j.get("jobSlots", 1)) for j in comps if isinstance(j.get("jobSlots", None), (int, float)))
        cnt_slots = sum(1 for j in comps if isinstance(j.get("jobSlots", None), (int, float))) or 1
        avg_slots = max(1.0, avg_slots / cnt_slots)
        factor *= max(0.5, min(2.0, slots / avg_slots))

    return {
        "median": round(median, 2),
        "range": {"low": round(low * factor, 2), "high": round(high * factor, 2)},
        "samples": n,
        "tags_used": tags,
        "notes": "Heuristic estimate using median±0.5*IQR, adjusted by scope keywords and slots.",
    }

async def tool_proposal_template(ctx: Context, args: Dict[str, Any]):
    job_id: str = args.get("job_id")
    profile: Dict[str, Any] = args.get("profile", {}) or {}
    jobs = await fetch_jobs(ctx)
    job = next((j for j in jobs if j.get("id") == job_id), None)
    if not job:
        return {"error": f"Job {job_id} not found"}

    job_name = job.get("jobName", "")
    tags = ", ".join([t.get("jobCategoryName", "") for t in (job.get("jobTags", []) or [])])
    desc_points = [d for d in (job.get("jobDescription", []) or []) if isinstance(d, str)]
    salary = job.get("jobSalary", None)

    p_name = profile.get("name", "")
    p_skills = profile.get("skills", []) or []
    p_ach = profile.get("achievements", []) or []

    template = {
        "title": f"Proposal for {job_name}",
        "introduction": f"Hello{(' ' + p_name) if p_name else ''}, I’d love to help with {job_name}. I have experience in {', '.join(p_skills) if p_skills else 'relevant areas'}.",
        "understanding": "Key points from your brief:",
        "scope_breakdown": desc_points[:6],
        "approach": [
            "Clarify success metrics and constraints",
            "Design and plan the solution with milestones",
            "Implement iteratively with regular check-ins",
            "Testing and quality assurance",
            "Handover and documentation",
        ],
        "deliverables": [
            "Clear milestone plan",
            "Working solution matching requirements",
            "Documentation and basic training",
        ],
        "timeline": "Estimated 1–4 weeks depending on final scope",
        "budget_hint": f"Target budget around {salary} (adjustable)" if isinstance(salary, (int, float)) else "Budget to be discussed based on scope",
        "why_me": ("Highlights: " + "; ".join(p_ach)) if p_ach else "I focus on clarity, reliability, and timely delivery.",
        "tags": tags,
    }
    return template

async def tool_find_talent(ctx: Context, args: Dict[str, Any]):
    job_tags: List[str] = args.get("job_tags", [])
    ctx.logger.info(f"Fetching data for talent search for job_tags='{job_tags}'")

    # 1. Fetch all necessary data
    users = await fetch_users(ctx)
    ctx.logger.info(f"Fetched {len(users)} users.")

    # 2. Create a virtual target job from the provided tags
    # Ini memungkinkan LLM untuk memproses permintaan tanpa memerlukan job_id yang ada
    target_job = {
        "jobName": f"Pekerjaan dengan kategori: {', '.join(job_tags)}",
        "jobTags": [{"jobCategoryName": tag} for tag in job_tags],
        "jobDescription": [f"Mencari talenta yang ahli dalam bidang {', '.join(job_tags)}."],
        # Tambahkan field lain jika diperlukan untuk pemrosesan LLM
    }
    
    # 3. Filter users who have completed their profile
    active_users = [u for u in users if u.get("isProfileCompleted")]
    ctx.logger.info(f"Found {len(active_users)} active users with completed profiles.")

    # 4. Return the raw data for the LLM to process
    # LLM akan menerima pekerjaan target "virtual" dan daftar kandidat potensial
    return {
        "target_job": target_job,
        "potential_candidates": active_users
    }


# --------------------------
# Dispatcher untuk tool calls dari ASI1
# --------------------------

async def execute_tool(func_name: str, arguments: dict, ctx: Context):
    # Log eksekusi tool
    ctx.logger.info(f"Executing tool '{func_name}' with arguments: {arguments}")
    
    if func_name == "getAllJobs":
        return await tool_getAllJobs(ctx, arguments)
    # BAGIAN 5: Dispatcher untuk 'getAllUsers', sama seperti 'getAllJobs'
    if func_name == "getAllUsers":
        return await tool_getAllUsers(ctx, arguments)
    if func_name == "recommend_jobs_by_skills":
        return await tool_recommend_jobs_by_skills(ctx, arguments)
    if func_name == "budget_advice":
        return await tool_budget_advice(ctx, arguments)
    if func_name == "proposal_template":
        return await tool_proposal_template(ctx, arguments)
    if func_name == "find_talent":
        return await tool_find_talent(ctx, arguments)
    
    ctx.logger.error(f"Unsupported function call: {func_name}")
    raise ValueError(f"Unsupported function call: {func_name}")

# --------------------------
# Orkestrasi: sama pola dengan agent.py
# --------------------------

async def process_query(query: str, ctx: Context) -> str:
    ctx.logger.info(f"--- Starting new query processing for: '{query}' ---")
    try:
        system_message = {
            "role": "system",
            "content": "Anda adalah asisten yang membantu pengguna menemukan talenta dan informasi pekerjaan. Selalu prioritaskan penggunaan 'tools' yang tersedia untuk menjawab pertanyaan secara akurat. Jika permintaan pengguna cocok dengan deskripsi sebuah tool, panggil tool tersebut."
        }
        initial_message = {"role": "user", "content": query}
        payload = {
            "model": "asi1-mini",
            "messages": [system_message, initial_message],
            "tools": tools,
            "temperature": 0.5,
            "max_tokens": 1024,
        }
        
        ctx.logger.info("-> Step 1: Sending query to LLM to determine tool calls...")
        r = requests.post(f"{ASI1_BASE_URL}/chat/completions", headers=ASI1_HEADERS, json=payload)
        r.raise_for_status()
        resp = r.json()
        ctx.logger.debug(f"LLM initial response: {resp}")


        tool_calls = resp["choices"][0]["message"].get("tool_calls", [])
        history = [system_message, initial_message, resp["choices"][0]["message"]]

        if not tool_calls:
            ctx.logger.warning("LLM did not request any tool calls. Returning direct response or a default message.")
            direct_response = resp["choices"][0]["message"].get("content")
            return direct_response or "Tidak ada fungsi yang perlu dijalankan. Tolong jelaskan kebutuhan Anda (skills, scope, atau ID job)."
        
        ctx.logger.info(f"-> Step 2: LLM requested {len(tool_calls)} tool call(s). Executing them...")
        for call in tool_calls:
            func_name = call["function"]["name"]
            arguments = json.loads(call["function"]["arguments"]) if call["function"].get("arguments") else {}
            call_id = call["id"]

            try:
                # 'execute_tool' sudah memiliki logging di dalamnya
                result = await execute_tool(func_name, arguments, ctx)
                content = json.dumps(result)
                ctx.logger.debug(f"Result for tool '{func_name}' (truncated): {content[:250]}...")
            except Exception as e:
                ctx.logger.error(f"Tool execution for '{func_name}' failed: {e}")
                content = json.dumps({"error": f"Tool execution failed: {e}"})

            history.append({"role": "tool", "tool_call_id": call_id, "content": content})

        final_payload = {
            "model": "asi1-mini",
            "messages": history,
            "temperature": 0.6,
            "max_tokens": 1024,
        }
        
        ctx.logger.info("-> Step 3: Sending tool results back to LLM for final answer...")
        rf = requests.post(f"{ASI1_BASE_URL}/chat/completions", headers=ASI1_HEADERS, json=final_payload)
        rf.raise_for_status()
        final = rf.json()
        
        final_answer = final["choices"][0]["message"]["content"]
        ctx.logger.info(f"-> Step 4: Final answer received from LLM.")
        ctx.logger.debug(f" {final_answer}")
        return final_answer
        
    except Exception as e:
        ctx.logger.error(f"An error occurred during process_query: {e}", exc_info=True)
        return f"Terjadi kesalahan: {e}"

# --------------------------
# uAgents bootstrap
# --------------------------

agent = Agent(name='advisor-agent', port=8002, mailbox=True,endpoint=["http://localhost:8002/submit"])
chat_proto = Protocol(spec=chat_protocol_spec)

@chat_proto.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    try:
        ack = ChatAcknowledgement(timestamp=datetime.now(timezone.utc), acknowledged_msg_id=msg.msg_id)
        await ctx.send(sender, ack)

        for item in msg.content:
            if isinstance(item, StartSessionContent):
                ctx.logger.info(f"Start session from {sender}")
                continue
            elif isinstance(item, TextContent):
                ctx.logger.info(f"Received message from {sender}: {item.text}")
                reply = await process_query(item.text, ctx)
                response = ChatMessage(timestamp=datetime.now(timezone.utc), msg_id=uuid4(), content=[TextContent(type="text", text=reply)])
                await ctx.send(sender, response)
            else:
                ctx.logger.info(f"Unexpected content from {sender}")
    except Exception as e:
        ctx.logger.error(f"handle_chat_message error: {e}", exc_info=True)
        err = ChatMessage(timestamp=datetime.now(timezone.utc), msg_id=uuid4(), content=[TextContent(type="text", text=f"Error: {e}")])
        await ctx.send(sender, err)

@chat_proto.on_message(model=ChatAcknowledgement)
async def handle_chat_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Ack from {sender} for {msg.acknowledged_msg_id}")

@agent.on_rest_post("/api/chat", ChatRequest, ChatResponse)
async def handle_chat_rest(ctx: Context, req: ChatRequest) -> ChatResponse:
    """
    REST endpoint untuk menerima chat dari frontend
    POST http://localhost:8002/api/chat
    Body: {"message": "your message here"}
    """
    try:
        ctx.logger.info(f"Received REST chat request: {req.message}")
        
        # Gunakan fungsi process_query yang sudah ada
        response = await process_query(req.message, ctx)
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now(timezone.utc).isoformat(),
            status="success"
        )
    except Exception as e:
        ctx.logger.error(f"Error processing REST chat request: {e}")
        return ChatResponse(
            response=f"Terjadi kesalahan: {str(e)}",
            timestamp=datetime.now(timezone.utc).isoformat(),
            status="error"
        )

@agent.on_rest_get("/api/health", HealthResponse)
async def handle_health_check(ctx: Context) -> Dict[str, Any]:
    """
    Health check endpoint
    GET http://localhost:8002/api/health
    """
    return {
        "status": "healthy",
        "agent_name": agent.name,
        "agent_address": ctx.agent.address,
        "port": 8002
    }

@agent.on_rest_get("/api/jobs", JobsResponse)
async def handle_get_jobs(ctx: Context) -> JobsResponse:
    """
    REST endpoint untuk mendapatkan semua jobs
    GET http://localhost:8002/api/jobs
    """
    try:
        jobs = await fetch_jobs(ctx)
        return JobsResponse(
            jobs=jobs,
            count=len(jobs),
            timestamp=datetime.now(timezone.utc).isoformat(),
            status="success"
        )
    except Exception as e:
        return JobsResponse(
            jobs=[],
            count=0,
            timestamp=datetime.now(timezone.utc).isoformat(),
            status=f"error: {str(e)}"
        )

# Tambahkan CORS headers jika diperlukan (optional)
async def setup_cors(ctx: Context):
    """Setup CORS jika diperlukan untuk frontend"""
    ctx.logger.info("Agent started with REST endpoints:")
    ctx.logger.info("  POST /api/chat - Chat dengan agent")
    ctx.logger.info("  GET /api/health - Health check")
    ctx.logger.info("  GET /api/jobs - Dapatkan semua jobs")
    ctx.logger.info(f"  Server running on http://localhost:8002")



agent.include(chat_proto)
agent._on_startup.append(setup_cors)

if __name__ == "__main__":
    agent.run()