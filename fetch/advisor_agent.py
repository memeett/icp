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
from uagents import Agent, Context, Protocol
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
USER_CANISTER_ID = "v27v7-7x777-77774-qaaha-cai"
RATING_CANISTER_ID = "vb2j2-fp777-77774-qaafq-cai"

BASE_URL = "http://127.0.0.1:4943"
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

def with_host(headers: dict, canister_id: str) -> dict:
    return {**headers, "Host": f"{canister_id}.localhost"}

# Cache ringan untuk jobs agar beberapa tools tidak memanggil canister berulang dalam satu sesi
_JOBS_CACHE: Dict[str, Any] = {"data": None, "ts": 0.0}
_USERS_CACHE: Dict[str, Any] = {"data": None, "ts": 0.0}
_RATINGS_CACHE: Dict[str, Any] = {"data": None, "ts": 0.0}
_CACHE_TTL = 60.0  # detik

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
            "description": "Ambil semua user dari platform (via ICP HTTP).",
            "parameters": {"type": "object", "properties": {}, "required": []},
            "strict": True,
        },
    },
    {
        "type": "function",
        "function": {
            "name": "proposal_template",
            "description": "Hasilkan template proposal personal berbasis detail job dan profil opsional.",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_id": {"type": "string"},
                    "profile": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "skills": {"type": "array", "items": {"type": "string"}},
                            "achievements": {"type": "array", "items": {"type": "string"}},
                        },
                        "additionalProperties": False,
                    },
                },
                "required": ["job_id"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    },
    {
        "type": "function",
        "function": {
            "name": "find_talent",
            "description": "Rekomendasikan freelancer terbaik untuk job tertentu berdasarkan skill dan rating.",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_id": {"type": "string", "description": "ID dari job yang membutuhkan talent."},
                    "top_n": {"type": "integer", "default": 3, "minimum": 1, "maximum": 10},
                },
                "required": ["job_id"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    },
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

    # Coba POST dulu karena beberapa query butuh body
    try:
        resp = requests.post(url, headers=headers_with_host, json={}, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list):
            cache["data"] = data
            cache["ts"] = time.time()
            return data
    except Exception as e:
        errors.append(f"POST to {endpoint} failed: {e}")

    # Fallback ke GET
    try:
        resp = requests.get(url, headers=headers_with_host, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list):
            cache["data"] = data
            cache["ts"] = time.time()
            return data
    except Exception as e:
        errors.append(f"GET to {endpoint} failed: {e}")

    raise RuntimeError(f"Failed to fetch from {endpoint}: " + " | ".join(errors))

async def fetch_jobs(ctx: Context) -> List[Dict[str, Any]]:
    return await _fetch_canister_data(ctx, _JOBS_CACHE, "getAllJobs", JOB_CANISTER_ID)

async def fetch_users(ctx: Context) -> List[Dict[str, Any]]:
    # Asumsi canister User punya endpoint /getAllUsers
    return await _fetch_canister_data(ctx, _USERS_CACHE, "getAllUsers", USER_CANISTER_ID)

async def fetch_ratings(ctx: Context) -> List[Dict[str, Any]]:
    # Asumsi canister Rating punya endpoint /getAllRating
    return await _fetch_canister_data(ctx, _RATINGS_CACHE, "getAllRating", RATING_CANISTER_ID)

# --------------------------
# Simple TF-IDF + cosine (tanpa dependency eksternal)
# --------------------------

_token_re = re.compile(r"[A-Za-z0-9]+")

def tokenize(text: str) -> List[str]:
    return [t.lower() for t in _token_re.findall(text or "")]

def build_doc(job: Dict[str, Any]) -> str:
    name = job.get("jobName", "")
    desc_list = job.get("jobDescription", []) or []
    desc = " ".join([d for d in desc_list if isinstance(d, str)])
    tags = " ".join([t.get("jobCategoryName", "") for t in job.get("jobTags", []) or []])
    return f"{name} {tags} {desc}"

def tf(tokens: List[str]) -> Dict[str, float]:
    c = Counter(tokens)
    total = float(sum(c.values())) or 1.0
    return {k: v / total for k, v in c.items()}

def compute_idf(docs_tokens: List[List[str]]) -> Dict[str, float]:
    df = defaultdict(int)
    N = len(docs_tokens)
    for toks in docs_tokens:
        for term in set(toks):
            df[term] += 1
    return {term: math.log((N + 1) / (df_cnt + 1)) + 1.0 for term, df_cnt in df.items()}

def vec(tf_map: Dict[str, float], idf_map: Dict[str, float]) -> Dict[str, float]:
    return {term: tfv * idf_map.get(term, 0.0) for term, tfv in tf_map.items()}

def cosine(a: Dict[str, float], b: Dict[str, float]) -> float:
    # dot
    dot = 0.0
    for k, av in a.items():
        dot += av * b.get(k, 0.0)
    # norms
    na = math.sqrt(sum(v * v for v in a.values()))
    nb = math.sqrt(sum(v * v for v in b.values()))
    if na == 0.0 or nb == 0.0:
        return 0.0
    return dot / (na * nb)

# --------------------------
# Tool handlers (local compute)
# --------------------------

async def tool_getAllJobs(ctx: Context, args: Dict[str, Any]):
    jobs = await fetch_jobs(ctx)
    return jobs

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

    scored.sort(key=lambda x: x["score"], reverse=True)
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
    job_id: str = args.get("job_id")
    top_n: int = int(args.get("top_n", 3))
    ctx.logger.info(f"Starting talent search for job_id='{job_id}' with top_n={top_n}")

    # 1. Fetch all data
    jobs = await fetch_jobs(ctx)
    users = await fetch_users(ctx)
    ratings = await fetch_ratings(ctx)
    ctx.logger.info(f"Fetched {len(jobs)} jobs, {len(users)} users, and {len(ratings)} ratings.")

    # 2. Find target job
    target_job = next((j for j in jobs if j.get("id") == job_id), None)
    if not target_job:
        ctx.logger.error(f"Job with id {job_id} not found in fetched data.")
        return {"error": f"Job {job_id} not found"}
    ctx.logger.info(f"Found target job: {target_job.get('jobName')}")

    # 3. Pre-calculate average ratings for all users
    user_ratings = defaultdict(lambda: {"sum": 0.0, "count": 0})
    for r in ratings:
        user_id = r.get("user_id")
        rating_val = r.get("rating")
        if user_id and isinstance(rating_val, (int, float)):
            user_ratings[user_id]["sum"] += float(rating_val)
            user_ratings[user_id]["count"] += 1
    
    avg_ratings = {
        uid: data["sum"] / data["count"]
        for uid, data in user_ratings.items() if data["count"] > 0
    }

    # 4. Calculate skill scores for all users against the target job
    job_doc = build_doc(target_job)
    job_tokens = tokenize(job_doc)
    
    all_user_skills = [" ".join(u.get("preference", []) or []) for u in users]
    all_docs = [job_doc] + all_user_skills
    all_tokens = [tokenize(d) for d in all_docs]
    
    idf_map = compute_idf(all_tokens)
    job_vec = vec(tf(job_tokens), idf_map)

    scored_users = []
    for user in users:
        user_skills = " ".join(user.get("preference", []) or [])
        user_tokens = tokenize(user_skills)
        user_vec = vec(tf(user_tokens), idf_map)
        
        skill_score = cosine(job_vec, user_vec)
        
        # 5. Combine scores (e.g., 60% skill, 40% rating)
        rating_score = avg_ratings.get(user.get("id"), 2.5) / 5.0  # Normalize 0-5 scale to 0-1, default 2.5
        final_score = 0.6 * skill_score + 0.4 * rating_score
        
        scored_users.append({
            "user": {
                "id": user.get("id"),
                "username": user.get("username"),
                "skills": user.get("preference", []),
            },
            "scores": {
                "final": round(final_score, 4),
                "skill_match": round(skill_score, 4),
                "avg_rating": round(avg_ratings.get(user.get("id"), 0), 2),
            }
        })

    # 6. Sort and return top N
    scored_users.sort(key=lambda x: x["scores"]["final"], reverse=True)
    
    ctx.logger.info(f"Top {top_n} recommendations: {[u['user']['username'] for u in scored_users[:top_n]]}")
    for u in scored_users[:top_n]:
        ctx.logger.info(f"  - {u['user']['username']}: Final={u['scores']['final']}, Skill={u['scores']['skill_match']}, Rating={u['scores']['avg_rating']}")

    return scored_users[:top_n]

# --------------------------
# Dispatcher untuk tool calls dari ASI1
# --------------------------

async def execute_tool(func_name: str, arguments: dict, ctx: Context):
    if func_name == "getAllJobs":
        return await tool_getAllJobs(ctx, arguments)
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
    raise ValueError(f"Unsupported function call: {func_name}")

# --------------------------
# Orkestrasi: sama pola dengan agent.py
# --------------------------

async def process_query(query: str, ctx: Context) -> str:
    try:
        initial_message = {"role": "user", "content": query}
        payload = {
            "model": "asi1-mini",
            "messages": [initial_message],
            "tools": tools,
            "temperature": 0.5,
            "max_tokens": 1024,
        }
        r = requests.post(f"{ASI1_BASE_URL}/chat/completions", headers=ASI1_HEADERS, json=payload)
        r.raise_for_status()
        resp = r.json()

        tool_calls = resp["choices"][0]["message"].get("tool_calls", [])
        history = [initial_message, resp["choices"][0]["message"]]
        if not tool_calls:
            return "Tidak ada fungsi yang perlu dijalankan. Tolong jelaskan kebutuhan Anda (skills, scope, atau ID job)."

        for call in tool_calls:
            func_name = call["function"]["name"]
            arguments = json.loads(call["function"]["arguments"]) if call["function"].get("arguments") else {}
            call_id = call["id"]

            try:
                result = await execute_tool(func_name, arguments, ctx)
                content = json.dumps(result)
            except Exception as e:
                content = json.dumps({"error": f"Tool execution failed: {e}"})

            history.append({"role": "tool", "tool_call_id": call_id, "content": content})

        final_payload = {
            "model": "asi1-mini",
            "messages": history,
            "temperature": 0.6,
            "max_tokens": 1024,
        }
        rf = requests.post(f"{ASI1_BASE_URL}/chat/completions", headers=ASI1_HEADERS, json=final_payload)
        rf.raise_for_status()
        final = rf.json()
        return final["choices"][0]["message"]["content"]
    except Exception as e:
        ctx.logger.error(f"process_query error: {e}")
        return f"Terjadi kesalahan: {e}"

# --------------------------
# uAgents bootstrap
# --------------------------

agent = Agent(name='advisor-agent', port=8002, mailbox=True)
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
                ctx.logger.info(f"Msg from {sender}: {item.text}")
                reply = await process_query(item.text, ctx)
                response = ChatMessage(timestamp=datetime.now(timezone.utc), msg_id=uuid4(), content=[TextContent(type="text", text=reply)])
                await ctx.send(sender, response)
            else:
                ctx.logger.info(f"Unexpected content from {sender}")
    except Exception as e:
        ctx.logger.error(f"handle_chat_message error: {e}")
        err = ChatMessage(timestamp=datetime.now(timezone.utc), msg_id=uuid4(), content=[TextContent(type="text", text=f"Error: {e}")])
        await ctx.send(sender, err)

@chat_proto.on_message(model=ChatAcknowledgement)
async def handle_chat_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Ack from {sender} for {msg.acknowledged_msg_id}")

agent.include(chat_proto)

if __name__ == "__main__":
    agent.run()
