module{
    public type User = {
        id: Text;
        username: Text;
        email: Text;
        wallet: Text;
        rating: Float;
        createdAt: Int;
        updatedAt: Int;
    };

    public type UpdateUserPayload = {
        username: ?Text;
        email: ?Text;
    };
}