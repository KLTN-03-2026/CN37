import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/UserApi";
import { logOut } from "../../api/AuthApi";
import styles from "./Home.module.scss"
import classNames from "classnames/bind";

  const cx = classNames.bind(styles);

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
    navigate("/login");
  };

  return (
    <div className={cx("container")}>
      <div>
        
      </div>
    </div>
  );
}

export default Home;