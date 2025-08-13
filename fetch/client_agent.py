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

ASI1_API_KEY = ""
ASI1_BASE_URL = "https://api.asi1.ai/v1"
ASI1_HEADERS = {
    "Authorization": f"Bearer {ASI1_API_KEY}",
    "Content-Type": "application/json"
}

# Your canister IDs from .env file or hardcoded fallback
USER_CANISTER_ID = os.getenv("CANISTER_ID_USER", "vu5yx-eh777-77774-qaaga-cai")
SESSION_CANISTER_ID = os.getenv("CANISTER_ID_SESSION", "vg3po-ix777-77774-qaafa-cai")
JOB_CANISTER_ID = os.getenv("CANISTER_ID_JOB", "rdmx6-jaaaa-aaaah-qca2a-cai")
AI_AGENT_CANISTER_ID = os.getenv("CANISTER_ID_AIAGENT", "rrkah-fqaaa-aaaah-qcuyq-cai")
APPLIER_CANISTER_ID = os.getenv("CANISTER_ID_APPLIER", "uxrrr-q7777-77774-qaaaq-cai")
RATING_CANISTER_ID = os.getenv("CANISTER_ID_RATING", "vpyes-67777-77774-qaaeq-cai")
BASE_URL = "http://127.0.0.1:4943"

print(f"🚀 Client Agent Initialization")
print(f"USER: {USER_CANISTER_ID}")
print(f"JOB: {JOB_CANISTER_ID}")
print(f"AI_AGENT: {AI_AGENT_CANISTER_ID}")

# Client agent tools
client_tools = [
    {
        "type": "function",
        "function": {
            "name": "create_job_posting",
            "description": "Create a new job posting on the platform",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_title": {"type": "string", "description": "Title of the job"},
                    "job_description": {"type": "string", "description": "Detailed description of the job"},
                    "required_skills": {"type": "array", "items": {"type": "string"}, "description": "Skills required for the job"},
                    "budget": {"type": "number", "description": "Budget for the job"}
                },
                "required": ["job_title", "job_description", "required_skills", "budget"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "find_suitable_freelancers",
            "description": "Find freelancers that are a good match for a job",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_id": {"type": "string", "description": "The ID of the job to find freelancers for"}
                },
                "required": ["job_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_budget_advice",
            "description": "Get advice on a reasonable budget for a job",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_description": {"type": "string", "description": "A description of the job requirements"}
                },
                "required": ["job_description"]
            }
        }
    }
]

async def call_canister_endpoint(canister_id: str, method: str, args):
    """Generic function to call any canister method with better error handling"""
    headers = {
        "Host": f"{canister_id}.localhost",
        "Content-Type": "application/json"
    }
    
    url = f"{BASE_URL}/?candid"
    
    payload = {
        "method": method,
        "arg": args
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
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

async def call_client_function(func_name: str, args: dict):
    """Handle client-specific function calls"""
    if func_name == "create_job_posting":
        # In a real implementation, you would call the JobCanister to create the job
        return {"status": "success", "job_id": "new_job_123", "message": f"Job '{args['job_title']}' created successfully."}
    
    elif func_name == "find_suitable_freelancers":
        # This would call the AiAgentCanister's matchFreelancers function
        # For now, we'll return mock data
        return {
            "status": "success",
            "freelancers": [
                {"id": "freelancer1", "name": "Alice", "match_score": 0.9, "skills": ["Python", "AI", "Motoko"]},
                {"id": "freelancer2", "name": "Bob", "match_score": 0.8, "skills": ["Python", "AI"]},
            ]
        }
        
    elif func_name == "get_budget_advice":
        # This would call the AiAgentCanister's getJobStats function
        return {"status": "success", "recommended_budget": "1000-1500 USD", "advice": "Based on similar jobs, a budget in this range is competitive."}
        
    else:
        raise ValueError(f"Unsupported function: {func_name}")

async def process_client_query(query: str, ctx: Context) -> str:
    """Process client-specific queries using an LLM"""
    try:
        initial_message = {
            "role": "system",
            "content": """You are a helpful assistant for clients on a decentralized freelance platform. You can help users:
1. **Create Job Postings**: Guide users step-by-step to create effective job posts.
2. **Find Freelancers**: Recommend the best freelancers for a project.
3. **Get Budget Advice**: Provide reasonable budget estimates for jobs.
You have access to real-time data from the platform's canisters. Always be helpful, professional, and provide actionable advice."""
        }
        
        user_message = {
            "role": "user",
            "content": query
        }
        
        payload = {
            "model": "asi1-mini",
            "messages": [initial_message, user_message],
            "tools": client_tools,
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
        
        tool_calls = response_json["choices"][0]["message"].get("tool_calls", [])
        messages_history = [initial_message, user_message, response_json["choices"][0]["message"]]
        
        for tool_call in tool_calls:
            func_name = tool_call["function"]["name"]
            arguments = json.loads(tool_call["function"]["arguments"])
            tool_call_id = tool_call["id"]
            
            ctx.logger.info(f"Executing {func_name} with arguments: {arguments}")
            
            try:
                result = await call_client_function(func_name, arguments)
                content_to_send = json.dumps(result, default=str)
            except Exception as e:
                ctx.logger.error(f"Tool execution failed: {str(e)}")
                error_content = {"error": f"Tool execution failed: {str(e)}", "status": "failed"}
                content_to_send = json.dumps(error_content)
            
            tool_result_message = {
                "role": "tool",
                "tool_call_id": tool_call_id,
                "content": content_to_send
            }
            messages_history.append(tool_result_message)
        
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
        ctx.logger.error(f"Error processing client query: {str(e)}")
        return f"I apologize, but I encountered an error while processing your request: {str(e)}"

# Create client agent
client_agent = Agent(
    name='client-assistant',
    port=8003,
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
                ctx.logger.info(f"💬 Client query from {sender}: {item.text}")
                response_text = await process_client_query(item.text, ctx)
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

client_agent.include(chat_proto)

if __name__ == "__main__":
    print("🚀 Starting Client Assistant Agent...")
    print("Agent available at: http://127.0.0.1:8003")
    print("Chat with me about creating jobs and finding freelancers!")
    client_agent.run()