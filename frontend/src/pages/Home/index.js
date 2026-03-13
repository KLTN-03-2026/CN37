import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/UserApi";
import { logOut } from "../../api/AuthApi";

function Home() {

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  const handleGetUser = async() => {
    try {

      const res = await getUser();
      setUser(res.data);
    } catch (error) {

      console.log("Get user lỗi");

    }
  };

  // logout
  const handleLogout = async () => {
    await logOut(localStorage.getItem("refreshToken"));
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (

    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>Trang Home</h1>

      <div style={{ marginTop: "20px" }}>
        <h3>Session User</h3>
        <p>UserId: {userId}</p>
      </div>
      <button onClick={handleGetUser}>
        Get User
      </button>

      {user && (
        <div style={{ marginTop: "20px" }}>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          background: "#e74c3c",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Đăng xuất
      </button>

    </div>
  );
}

export default Home;