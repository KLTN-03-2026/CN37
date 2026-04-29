// tabs/UserSecurity.jsx
export default function UserSecurity({ user, onResetPassword }) {

  const handleReset = async () => {
    // if (!confirm("Reset mật khẩu user này?")) return;

    const token = await onResetPassword(user.id);

    alert("Token reset:\n" + token);
  };

  return (
    <div>
      <p>Email verified: {user.emailVerified ? "✔" : "❌"}</p>

      <button onClick={handleReset}>
        🔑 Reset Password
      </button>
    </div>
  );
}