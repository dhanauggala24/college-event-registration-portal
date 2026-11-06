
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/registrations/my-registrations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch registrations.");
          return;
        }

        setRegistrations(data.registrations);
      } catch (err) {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      <h2>My Event Registrations</h2>

      {loading ? (
        <p>Loading registrations...</p>
      ) : error ? (
        <p>{error}</p>
      ) : registrations.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        registrations.map((registration) => (
          <div key={registration._id}>
            <h3>{registration.event?.title || "Event unavailable"}</h3>
            <p>Venue: {registration.event?.venue}</p>
            <p>Status: {registration.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentDashboard;
