
import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchRegistrations = async () => {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/registrations/my-registrations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load registrations.");
          return;
        }

        setRegistrations(data.registrations || []);
      } catch (err) {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const registeredCount = registrations.filter(
    (item) => item.status === "registered"
  ).length;

  const otherCount = registrations.length - registeredCount;

  return (
    <div className="student-dashboard">

      {/* SIDEBAR */}
      <aside className="student-sidebar">

        <div className="student-brand">
          <div className="student-brand-icon">C</div>
          <div>
            <h2>CampusEvents</h2>
            <span>STUDENT PORTAL</span>
          </div>
        </div>

        <div className="student-sidebar-label">MAIN MENU</div>

        <nav className="student-nav">
          <button
            className="student-nav-link active"
            onClick={() => navigate("/dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="student-nav-link"
            onClick={() => navigate("/events")}
          >
            <span>◈</span>
            Explore Events
          </button>

          <button
            className="student-nav-link"
            onClick={() =>
              document.getElementById("my-registrations")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <span>▤</span>
            My Registrations
          </button>
        </nav>

        <div className="student-sidebar-bottom">
          <div className="student-sidebar-user">
            <div className="student-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="student-sidebar-user-info">
              <strong>{user?.fullName || "Student"}</strong>
              <span>Student Account</span>
            </div>
          </div>

          <button className="student-logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="student-main">

        <header className="student-topbar">
          <div>
            <span className="student-topbar-label">STUDENT PORTAL</span>
            <h2>Dashboard</h2>
          </div>

          <div className="student-profile">
            <div className="student-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div>
              <strong>{user?.fullName || "Student"}</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        <section className="student-welcome">
          <div>
            <span>WELCOME BACK!</span>
            <h1>Hello, {user?.fullName || "Student"} 👋</h1>
            <p>
              Discover exciting campus events and keep track of your
              registrations.
            </p>
          </div>

          <button onClick={() => navigate("/events")}>
            Explore Events →
          </button>
        </section>

        {/* STATISTICS */}
        <section className="student-stats">
          <div className="student-stat-card">
            <div className="student-stat-icon blue">▤</div>
            <div>
              <span>Total Registrations</span>
              <h2>{registrations.length}</h2>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-icon green">✓</div>
            <div>
              <span>Confirmed</span>
              <h2>{registeredCount}</h2>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="student-stat-icon orange">◷</div>
            <div>
              <span>Other Status</span>
              <h2>{otherCount}</h2>
            </div>
          </div>
        </section>

        {/* REGISTRATIONS */}
        <section
          className="registrations-section"
          id="my-registrations"
        >
          <div className="registrations-heading">
            <div>
              <span>YOUR ACTIVITY</span>
              <h2>My Registrations</h2>
              <p>Events you have registered for.</p>
            </div>

            <button onClick={() => navigate("/events")}>
              + Find Events
            </button>
          </div>

          {loading ? (
            <div className="student-empty-state">
              Loading your registrations...
            </div>
          ) : error ? (
            <div className="student-empty-state error-message">
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="student-empty-state">
              <div>🎓</div>
              <h3>No registrations yet</h3>
              <p>Explore campus events and register for your first event.</p>
              <button onClick={() => navigate("/events")}>
                Explore Events
              </button>
            </div>
          ) : (
            <div className="student-registration-grid">
              {registrations.map((registration) => (
                <article
                  className="student-event-card"
                  key={registration._id}
                >
                  <div className="student-event-card-top">
                    <span>🎉 CAMPUS EVENT</span>
                    <span
                      className={`registration-status ${registration.status}`}
                    >
                      {registration.status}
                    </span>
                  </div>

                  <h3>
                    {registration.event?.title || "Event"}
                  </h3>

                  <div className="student-event-info">
                    <p>
                      <span>📍</span>
                      {registration.event?.venue || "Venue not announced"}
                    </p>
                    <p>
                      <span>📅</span>
                      {registration.event?.eventDate
                        ? new Date(
                            registration.event.eventDate
                          ).toLocaleDateString()
                        : "Date not announced"}
                    </p>
                  </div>

                  <div className="student-registration-id">
                    Registration ID: {registration._id}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="student-dashboard-footer">
          © 2026 CampusEvents · Student Portal
        </footer>

      </main>
    </div>
  );
}

export default StudentDashboard;
