// Client Agent Canister
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Time "mo:base/Time";

persistent actor {
  // ----- Type definitions -----
  type HeaderField = (Text, Text);

  type HttpRequest = {
    method : Text;
    url : Text;
    headers : [HeaderField];
    body : Blob;
    certificate_version : ?Nat16;
  };

  type HttpResponse = {
    status_code : Nat16;
    headers : [HeaderField];
    body : Blob;
    streaming_strategy : ?Null;
    upgrade : ?Bool;
  };

  // API response types
  type WelcomeResponse = {
    message : Text;
  };

  // ----- Public API functions -----

  // Welcome message
  public shared query func welcome() : async WelcomeResponse {
    {
      message = "Welcome to the Client Agent Canister API";
    };
  };

  // ----- Private helper functions -----

  // Constructs a JSON HTTP response
  private func makeJsonResponse(statusCode : Nat16, jsonContent : Text) : HttpResponse {
    {
      status_code = statusCode;
      headers = [("content-type", "application/json"), ("access-control-allow-origin", "*")];
      body = Text.encodeUtf8(jsonContent);
      streaming_strategy = null;
      upgrade = ?true;
    };
  };

  // Handles simple HTTP routes (GET/OPTIONS and fallback)
  private func handleRoute(method : Text, url : Text, _body : Blob) : HttpResponse {
    let normalizedUrl = Text.trimEnd(url, #text "/");

    switch (method, normalizedUrl) {
      case ("GET", "" or "/") {
        makeJsonResponse(200, "{\"message\": \"Welcome to the Client Agent Canister API\"}");
      };
      case ("OPTIONS", _) {
        {
          status_code = 200;
          headers = [("access-control-allow-origin", "*"), ("access-control-allow-methods", "GET, POST, OPTIONS"), ("access-control-allow-headers", "Content-Type")];
          body = Text.encodeUtf8("");
          streaming_strategy = null;
          upgrade = null;
        };
      };
      case _ {
        {
          status_code = 404;
          headers = [("content-type", "application/json")];
          body = Text.encodeUtf8("Not found: " # url);
          streaming_strategy = null;
          upgrade = null;
        };
      };
    };
  };

  // HTTP query interface for GET/OPTIONS and static responses
  public query func http_request(req : HttpRequest) : async HttpResponse {
    return handleRoute(req.method, req.url, req.body);
  };

  // HTTP update interface for POST routes requiring async calls
  public func http_request_update(req : HttpRequest) : async HttpResponse {
    // For now, just route to the simple handler. This can be expanded later.
    return handleRoute(req.method, req.url, req.body);
  };
};