import Text "mo:base/Text";
actor Authentication{
    stable var token_id : Text = "";

    public shared func setToken(token: Text): async(){
        token_id := token;
    };

    public func getToken(): async Text{
        return token_id;
    };
}