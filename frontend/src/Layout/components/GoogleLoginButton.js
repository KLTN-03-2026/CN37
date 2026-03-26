import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/AxiosClient";
import { deviceInfo } from "../../helper/GetDeviceInfoHelper";

function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    try {
      const res = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
        DeviceInfo: deviceInfo
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

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

export default GoogleLoginButton;