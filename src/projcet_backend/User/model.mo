import Time "mo:base/Time";
module{
    public type User = {
        id: Text;
        profilePicture: Text;
        username: Text;
        email: Text;
        wallet: Float;
        description: Text;
        rating: Float;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        isFaceRecognitionOn: Bool;
    };

    public type UpdateUserPayload = {
        username: ?Text;
        email: ?Text;
        description: ?Text;
    };
}