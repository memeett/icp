import requests
import json
import os
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    StartSessionContent,
)
from uagents import Agent, Context, Protocol
from datetime import datetime, timezone, timedelta
from uuid import uuid4

# Try to load environment variables, fallback if dotenv not available
try:
    from dotenv import load_dotenv
    # Try different paths for .env file
    env_paths = [
        "../.env",  # One level up
        "../../.env",  # Two levels up  
        "../../../.env",  # Three levels up (original path)
        "../../../../.env"  # Four levels up
    ]
    
    env_loaded = False
    for env_path in env_paths:
        if os.path.exists(env_path):
            load_dotenv(env_path)
            print(f"✅ Loaded .env from: {env_path}")
            env_loaded = True
            break
    
    if not env_loaded:
        print("⚠️  .env file not found, using hardcoded values")
        
except ImportError:
    print("⚠️  python-dotenv not installed, using hardcoded values")

ASI1_API_KEY = "sk_fe44d0a20765479e8b337a7fb024c9c82005e45674204774b8c911e5f3a38a91"
ASI1_BASE_URL = "https://api.asi1.ai/v1"
ASI1_HEADERS = {
    "Authorization": f"Bearer {ASI1_API_KEY}",
    "Content-Type": "application/json"
}

# Your canister IDs from .env file or hardcoded fallback
USER_CANISTER_ID = os.getenv("CANISTER_ID_USER", "vu5yx-eh777-77774-qaaga-cai")
SESSION_CANISTER_ID = os.getenv("CANISTER_ID_SESSION", "vg3po-ix777-77774-qaafa-cai")
JOB_CANISTER_ID = os.getenv("CANISTER_ID_JOB", "rdmx6-jaaaa-aaaah-qca2a-cai")  # Updated from .env
AI_AGENT_CANISTER_ID = os.getenv("CANISTER_ID_AIAGENT", "rrkah-fqaaa-aaaah-qcuyq-cai")  # AI Agent canister
APPLIER_CANISTER_ID = os.getenv("CANISTER_ID_APPLIER", "uxrrr-q7777-77774-qaaaq-cai")  # From your .env
RATING_CANISTER_ID = os.getenv("CANISTER_ID_RATING", "vpyes-67777-77774-qaaeq-cai")  # From your .env
BASE_URL = "http://127.0.0.1:4943"

print(f"🚀 Freelancer Agent Initialization")
print(f"USER: {USER_CANISTER_ID}")
print(f"JOB: {JOB_CANISTER_ID}")
print(f"APPLIER: {APPLIER_CANISTER_ID}")
print(f"RATING: {RATING_CANISTER_ID}")

# Freelancer agent tools - connecting to real canisters
freelancer_tools = [
    {
        "type": "function",
        "function": {
            "name": "get_user_profile",
            "description": "Get current user profile including skills, preferences, and role",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID to fetch profile for"
                    }
                },
                "required": ["user_id"],
                "additionalProperties": False
            },
            "strict": True
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_all_jobs",
            "description": "Get all available job postings",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
                "additionalProperties": False
            },
            "strict": True
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_jobs_by_skills",
            "description": "Find jobs that match specific skills",
            "parameters": {
                "type": "object",
                "properties": {
                    "skills": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Skills to match jobs against"
                    }
                },
                "required": ["skills"],
                "additionalProperties": False
            },
            "strict": True
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_job_details",
            "description": "Get detailed information about a specific job",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_id": {
                        "type": "string",
                        "description": "Job ID to get details for"
                    }
                },
                "required": ["job_id"],
                "additionalProperties": False
            },
            "strict": True
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_user_applications",
            "description": "Get user's job application history",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID to get applications for"
                    }
                },
                "required": ["user_id"],
                "additionalProperties": False
            },
            "strict": True
        }
    },
    {
        "type": "function",
        "function": {
            "name": "analyze_job_compatibility",
            "description": "Analyze how well a job matches user's skills and preferences",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_id": {
                        "type": "string",
                        "description": "Job ID to analyze"
                    },
                    "user_id": {
                        "type": "string",
                        "description": "User ID to compare against"
                    }
                },
                "required": ["job_id", "user_id"],
                "additionalProperties": False
            },
            "strict": True
        }
    }
]

async def call_canister_endpoint(canister_id: str, method: str, args):
    """Generic function to call any canister method with better error handling"""
    headers = {
        "Host": f"{canister_id}.localhost",
        "Content-Type": "application/json"
    }
    
    # Use proper IC-style URL structure
    url = f"{BASE_URL}/?candid"
    
    # Create proper IC request payload
    payload = {
        "method": method,
        "arg": args
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        # Check if response is HTML (error page)
        if response.headers.get('content-type', '').startswith('text/html'):
            raise Exception(f"Canister {canister_id} returned HTML error - canister method '{method}' may not exist or canister not properly deployed")
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"HTTP {response.status_code}: {response.text[:200]}...")
            
    except requests.exceptions.Timeout:
        raise Exception(f"Timeout calling {method} on canister {canister_id}")
    except requests.exceptions.ConnectionError:
        raise Exception(f"Connection failed to canister {canister_id} - is dfx running?")
    except Exception as e:
        raise Exception(f"Canister call failed for {method}: {str(e)[:200]}...")

async def call_freelancer_function(func_name: str, args: dict):
    """Handle freelancer-specific function calls"""
    
    if func_name == "get_user_profile":
        # Call user canister to get profile
        return await call_canister_endpoint(
            USER_CANISTER_ID, 
            "getUserById", 
            args["user_id"]
        )
    
    elif func_name == "get_all_jobs":
        # This function will now call the AiAgentCanister to get matched jobs
        # For now, we will just return a message indicating the change.
        return {"status": "info", "message": "This function is now handled by the 'analyze_job_compatibility' function."}
    
    elif func_name == "search_jobs_by_skills":
        # This function will now call the AiAgentCanister's matchJobs function
        # First, get all jobs from the JobCanister
        all_jobs_raw = await call_canister_endpoint(JOB_CANISTER_ID, "getAllJobs", "")
        
        # Then, format the jobs data for the AiAgent
        all_jobs = []
        for job in all_jobs_raw:
            all_jobs.append({
                "id": job.get("id"),
                "requiredSkills": [tag.get("jobCategoryName") for tag in job.get("jobTags", [])],
                "description": job.get("jobDescription", [""])[0]
            })

        # This is a simplified example; in a real app, you'd get the user's profile dynamically
        user_profile = {"id": "user123", "skills": args["skills"], "preferences": []}

        # Finally, call the AiAgentCanister to get the matched jobs
        return await call_canister_endpoint(
            AI_AGENT_CANISTER_ID,
            "matchJobs",
            {"userProfile": user_profile, "allJobs": all_jobs}
        )
    
    elif func_name == "get_job_details":
        # Get specific job details
        if JOB_CANISTER_ID:
            return await call_canister_endpoint(
                JOB_CANISTER_ID,
                "getJobById",
                args["job_id"]
            )
        else:
            return {
                "id": args["job_id"],
                "jobName": "Sample Job",
                "jobDescription": ["This is a sample job posting"],
                "jobSalary": 1000,
                "jobStatus": "open"
            }
    
    elif func_name == "get_user_applications":
        # Call applier canister
        if APPLIER_CANISTER_ID:
            return await call_canister_endpoint(
                APPLIER_CANISTER_ID,
                "getAppliersByUserId",
                args["user_id"]
            )
        else:
            return [
                {
                    "id": "app_001",
                    "jobId": "job_001",
                    "userId": args["user_id"],
                    "status": "applied",
                    "appliedAt": "2025-08-10"
                }
            ]
    
    elif func_name == "analyze_job_compatibility":
        # This function will now call the AiAgentCanister's matchJobs function
        # For now, we'll return mock data
        return {
            "status": "success",
            "jobs": [
                {"id": "job1", "title": "Motoko Developer", "match_score": 0.95, "reason": "Excellent match for your Motoko skills"},
                {"id": "job2", "title": "Python AI Engineer", "match_score": 0.85, "reason": "Good match for your Python and AI experience"},
            ]
        }
    
    else:
        raise ValueError(f"Unsupported function: {func_name}")

async def process_freelancer_query(query: str, ctx: Context) -> str:
    """Process freelancer-specific queries using real canister data"""
    try:
        # Enhanced system prompt for freelancer assistant
        initial_message = {
            "role": "system",
            "content": """You are a helpful freelancer assistant for a decentralized freelance platform. You can help users:

1. **Find Job Opportunities**: Search and recommend jobs based on skills and preferences
2. **Analyze Job Compatibility**: Check how well jobs match user profiles  
3. **View Application History**: Track applied jobs and their status
4. **Career Guidance**: Provide advice on skill development and market trends
5. **Profile Insights**: Help optimize freelancer profiles for better job matching

You have access to real-time data from the platform's canisters including:
- User profiles with skills and preferences  
- Job postings with requirements and budgets
- Application history and status
- Rating and reputation data

Always be helpful, professional, and provide actionable advice. When recommending jobs, explain why they're a good match. When analyzing compatibility, be specific about matching and missing skills."""
        }
        
        user_message = {
            "role": "user", 
            "content": query
        }
        
        payload = {
            "model": "asi1-mini",
            "messages": [initial_message, user_message],
            "tools": freelancer_tools,
            "temperature": 0.7,
            "max_tokens": 1024
        }
        
        response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=payload
        )
        response.raise_for_status()
        response_json = response.json()
        
        # Execute tool calls if any
        tool_calls = response_json["choices"][0]["message"].get("tool_calls", [])
        messages_history = [initial_message, user_message, response_json["choices"][0]["message"]]
        
        for tool_call in tool_calls:
            func_name = tool_call["function"]["name"]
            arguments = json.loads(tool_call["function"]["arguments"])
            tool_call_id = tool_call["id"]
            
            ctx.logger.info(f"Executing {func_name} with arguments: {arguments}")
            
            try:
                result = await call_freelancer_function(func_name, arguments)
                content_to_send = json.dumps(result, default=str)[:2000]  # Limit content size
            except Exception as e:
                ctx.logger.error(f"Tool execution failed: {str(e)}")
                error_content = {
                    "error": f"Tool execution failed: {str(e)}",
                    "status": "failed"
                }
                content_to_send = json.dumps(error_content)
            
            tool_result_message = {
                "role": "tool",
                "tool_call_id": tool_call_id,
                "content": content_to_send
            }
            messages_history.append(tool_result_message)
        
        # Get final response from ASI1
        final_payload = {
            "model": "asi1-mini",
            "messages": messages_history,
            "temperature": 0.7,
            "max_tokens": 1024
        }
        
        final_response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=final_payload
        )
        final_response.raise_for_status()
        final_response_json = final_response.json()
        
        return final_response_json["choices"][0]["message"]["content"]
        
    except Exception as e:
        ctx.logger.error(f"Error processing freelancer query: {str(e)}")
        return f"I apologize, but I encountered an error while processing your request: {str(e)}"

# Create freelancer agent
freelancer_agent = Agent(
    name='freelancer-assistant',
    port=8002,
    mailbox=True
)

chat_proto = Protocol(spec=chat_protocol_spec)

@chat_proto.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    try:
        ack = ChatAcknowledgement(
            timestamp=datetime.now(timezone.utc),
            acknowledged_msg_id=msg.msg_id
        )
        await ctx.send(sender, ack)

        for item in msg.content:
            if isinstance(item, StartSessionContent):
                ctx.logger.info(f"Got a start session message from {sender}")
                continue
            elif isinstance(item, TextContent):
                ctx.logger.info(f"💬 Freelancer query from {sender}: {item.text}")
                response_text = await process_freelancer_query(item.text, ctx)
                ctx.logger.info(f"📝 Response: {response_text[:100]}...")
                response = ChatMessage(
                    timestamp=datetime.now(timezone.utc),
                    msg_id=uuid4(),
                    content=[TextContent(type="text", text=response_text)]
                )
                await ctx.send(sender, response)
            else:
                ctx.logger.info(f"Got unexpected content from {sender}")
    except Exception as e:
        ctx.logger.error(f"Error handling chat message: {str(e)}")
        error_response = ChatMessage(
            timestamp=datetime.now(timezone.utc),
            msg_id=uuid4(),
            content=[TextContent(type="text", text=f"An error occurred: {str(e)}")]
        )
        await ctx.send(sender, error_response)

@chat_proto.on_message(model=ChatAcknowledgement)
async def handle_chat_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"✅ Received acknowledgement from {sender}")

freelancer_agent.include(chat_proto)

if __name__ == "__main__":
    print("🚀 Starting Freelancer Assistant Agent...")
    print("Agent available at: http://127.0.0.1:8002")
    print("Chat with me about jobs, skills, and career advice!")
    freelancer_agent.run()
