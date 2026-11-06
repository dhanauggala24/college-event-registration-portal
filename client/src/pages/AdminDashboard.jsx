
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminEventManagement from "../components/AdminEventManagement";

function AdminDashboard() {
  const [message, setMessage] = useState("Checking admin access...");
  const [authorized, setAuthorized] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/protected/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setMessage(data.message);
        setAuthorized(true);
      } catch (error) {
        setMessage("Unable to connect to server.");
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthorized(false);
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/create-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Admin account creation failed.");
        return;
      }

      setSuccess("New admin account created successfully!");

      setFormData({
        fullName: "",
        email: "",
        password: "",
      });

    } catch (error) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>{message}</p>

      {authorized && (
        <>
          <button onClick={handleLogout}>Logout</button>

          <hr />

          <h2>Admin Account Management</h2>

          <button
            onClick={() => {
              setShowAdminForm(!showAdminForm);
              setSuccess("");
              setError("");
            }}
          >
            {showAdminForm ? "Close Form" : "Create New Admin"}
          </button>

          {showAdminForm && (
            <div className="auth-container">
              <h2>Create Admin Account</h2>

              <form onSubmit={handleCreateAdmin}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Create Password (minimum 12 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={12}
                  required
                />

                {error && (
                  <p className="error-message">{error}</p>
                )}

                {success && (
                  <p className="success-message">{success}</p>
                )}

                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Admin Account"}
                </button>
              </form>
            </div>
          )}

          <hr />

          <AdminEventManagement />
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
