import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/AxiosClient";

function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      });

      localStorage.setItem("accessToken", res.data.accessToken);

      // redirect
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}