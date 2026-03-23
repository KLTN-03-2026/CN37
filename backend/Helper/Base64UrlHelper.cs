public static class Base64UrlHelper
{
    public static string Encode(byte[] input)
    {
        return Convert.ToBase64String(input)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }

    public static byte[] Decode(string input)
    {
        string padded = input
            .Replace("-", "+")
            .Replace("_", "/");

        switch (padded.Length % 4)
        {
            case 2: padded += "=="; break;
            case 3: padded += "="; break;
        }

        return Convert.FromBase64String(padded);
    }

    internal static string Encode(string id)
    {
        throw new NotImplementedException();
    }
}