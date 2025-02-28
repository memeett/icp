module{
    public type User = {
        id: Text;
        profilePicture: Blob;
        username: Text;
        email: Text;
        description: Text;
        wallet: Float;
        rating: Float;
        createdAt: Int;
        updatedAt: Int;
        isFaceRecognitionOn: Bool;

    };

    public type UpdateUserPayload = {
        username: ?Text;
        email: ?Text;
        description: ?Text;
    };
}