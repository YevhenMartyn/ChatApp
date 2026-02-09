namespace Domain.Common.Constants;

public enum RoleType
{
    Admin,
    User
}

public static class RoleConstants
{
    public const string Admin = nameof(RoleType.Admin);
    public const string User = nameof(RoleType.User);
}