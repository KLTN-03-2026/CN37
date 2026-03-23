import classNames from "classnames/bind";
import styles from "./AccountSetting.module.scss";
import { getUserFromToken } from "../../helper/JwtDecodeHelper";
import { notifySuccess, notifyError } from "../../components/Nofitication";
import { registerPasskey} from "../../api/PasskeyApi";

const cx = classNames.bind(styles);

function AccountSetting() {
  const user = getUserFromToken();

  return (
    <div style={{ padding: 40 }}>
      <h2>Passkey + JWT Demo</h2>
      {user && (
        <div>
          <p>User ID: {user.userId}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      <button
        onClick={() => {
          if (!user) {
            notifyError("User not authenticated");
            return;
          }
          registerPasskey(user.userId, user.email);
        }}
      >
        Register Passkey
      </button>

      <br />
      <br />
    </div>
  );
}

export default AccountSetting;
