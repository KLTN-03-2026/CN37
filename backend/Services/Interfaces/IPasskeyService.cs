using Fido2NetLib;

public interface IPasskeyService
{
    Task<CredentialCreateOptions> CreateRegisterOptions(long userId, string email);
    Task<bool> RegisterPasskey(long userId, AuthenticatorAttestationRawResponse response);
    Task<AssertionOptions> CreateLoginOptions();
    Task<AuthResponse> VerifyLogin(AuthenticatorAssertionRawResponse response);
}