Gateway canister (`projcet_backend_single`) — usage

Purpose
- The gateway provides a single entrypoint to forward requests to existing backend canisters.
- For safety, `http_request` (GET) returns 501 and is reserved for AI/internal use. Use POST (`http_request_update`) to forward.

How to forward via HTTP
- Send a POST to the gateway canister HTTP endpoint (replica):

  POST http://localhost:8000/api/v2/canister/<GATEWAY_CANISTER_ID>/http_call

- Include header `x-target-canister: <TARGET_CANISTER_ID>` to indicate the backend canister to forward to.
- The gateway forwards the whole HTTP request to the target canister's `http_request_update` handler and returns the target's response.

Request body
- The gateway accepts the same `HttpRequest` shape used across backend canisters. For a simple forward, send JSON matching:
  { "method": "POST", "url": "/somePath", "headers": [], "body": "<base64-or-text>", "certificate_version": null }

Notes
- The gateway uses inter-canister calls; forwarded calls incur update semantics and require await.
- For frontend interactions, prefer calling canister functions via Candid/actor bindings for typed safety. Use gateway POST forwarding for transitional scenarios or AI-integration routes.

If build fails locally
- In this environment the Motoko compiler flagged M0220 when building the gateway. If you see the same error:
  - Ensure your `moc`/dfx version matches the project expectations.
  - Try building only the canister: `dfx build projcet_backend_single` and inspect moc output.
  - If M0220 persists, consider moving forwarding logic into an existing canister that already compiles or expose a small typed wrapper function on the target canister.
