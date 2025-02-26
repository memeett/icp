module{
    public type User = {
        id: Text;
        username: Text;
        email: Text;
        wallet: Text;
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