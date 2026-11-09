
import API_URL from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      if (data.user.role !== loginType) {
        setError(
          `This account is not registered as ${
            loginType === "admin" ? "an Admin" : "a Student"
          }. Please select the correct login option.`
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="signup-background" aria-hidden="true">
        <div className="signup-slide slide-one"></div>
        <div className="signup-slide slide-two"></div>
        <div className="signup-slide slide-three"></div>
        <div className="signup-slide slide-four"></div>
      </div>

      <div className="signup-overlay"></div>

      <div className="login-card">
        <div className="login-header">
          <h1>CampusEvents</h1>
          <h2>Welcome Back!</h2>
          <p>Login to discover and participate in campus events.</p>
        </div>

        <div className="login-options">
          <button
            type="button"
            className={loginType === "student" ? "active" : ""}
            onClick={() => {
              setLoginType("student");
              setError("");
            }}
          >
            Student Login
          </button>

          <button
            type="button"
            className={loginType === "admin" ? "active" : ""}
            onClick={() => {
              setLoginType("admin");
              setError("");
            }}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {loginType === "student" && (
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
