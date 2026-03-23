using Fido2NetLib;

public class PasskeyRegisterVerifyRequest
{
    public long UserId { get; set; }
    public AuthenticatorAttestationRawResponse? Response { get; set; }
}