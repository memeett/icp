module{
    public type User = {
        id: Text;
        username: Text;
        email: Text;
        wallet: Float;
        rating: Float;
        createdAt: Int;
        updatedAt: Int;
        isFaceRecognitionOn: Bool;
    };

    public type UpdateUserPayload = {
        username: ?Text;
        email: ?Text;
    };
}