import { useEffect, useState } from "react";
import { getUserFromToken } from "../helper/JwtDecodeHelper";

export const useSubizUser = () => {
  const [user, setUser] = useState(getUserFromToken());

  // 🔥 1. Làm user reactive (theo dõi token thay đổi)
  useEffect(() => {
    const interval = setInterval(() => {
      const newUser = getUserFromToken();

      setUser((prev) =>
        prev?.userId !== newUser?.userId ? newUser : prev
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 🔥 2. Sync sang Subiz
  useEffect(() => {
    const waitForSubiz = (callback) => {
      const interval = setInterval(() => {
        if (window.subiz) {
          clearInterval(interval);
          callback();
        }
      }, 300);
    };

    waitForSubiz(() => {
      // 👇 reset trước để tránh dính user cũ
      window.subiz("resetCustomer");

      setTimeout(() => {
        if (user) {
          window.subiz("setCustomer", {
            id: user.userId,
            email: user.email,
            customFields: {
              role: user.role?.join(", "),
            },
          });
        }
      }, 500);
    });
  }, [user?.userId]);
};