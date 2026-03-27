import api from "./AxiosClient"

export const getSessions = (refreshToken) => {
  return api.get("/session/get-session", {
    params: {
      refreshToken: refreshToken
    },
  });
};

export const logoutSessionId = (sessionId) =>{
  console.log(sessionId);
  
  return api.post("/session/logout-session", { sessionId })
}