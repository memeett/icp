import Blob "mo:base/Blob";
module{
    public type User = {
        id: Text;
        profilePicture: Blob;
        username: Text;
        dob: Text;
        description: Text;
        wallet: Float;
        rating: Float;
        createdAt: Int;
        updatedAt: Int;
        isFaceRecognitionOn: Bool;
    };

    public type UpdateUserPayload = {
        username: ?Text;
        profilePicture: ?Blob;
        description: ?Text;
        dob : ?Text;
    };


}