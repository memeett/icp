module {
  public type User = {
    id: Text;
    username: Text;
    email: Text;
    role: UserRole; // "client" atau "freelancer"
    wallet: Text;
    rating: Float;
    createdAt: Int;
    updatedAt: Int;
  };

  public type UserRole = {
    #client;
    #freelancer;
  };

  public type CreateUserPayload = {
    username: Text;
    email: Text;
    role: UserRole;
    wallet: Text;
  };

  public type UpdateUserPayload = {
    username: ?Text;
    email: ?Text;
    wallet: ?Text;
  };
};
