
import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const eventId = searchParams.get("eventId");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    studentId: user?.studentId || "",
    department: "",
    year: "",
    phone: "",
  });

  useEffect(() => {
    if (!token || user?.role !== "student") {
      navigate("/login");
      return;
    }

    if (!eventId) {
      setError("Please select an event from the Events page.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load event.");
          return;
        }

        setEvent(data.event);
      } catch (err) {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!event || event.status !== "upcoming") {
      setError("This event is not open for registration.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/registrations/${eventId}`,
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
        setError(data.message || "Registration failed.");
        return;
      }

      setMessage("Registration successful!");
    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="registration-state">Loading registration form...</div>;
  }

  if (error && !event) {
    return <div className="registration-state error-message">{error}</div>;
  }

  if (!event) {
    return <div className="registration-state">Event not found.</div>;
  }

  if (message) {
    return (
      <div className="registration-success-page">
        <div className="registration-success-card">
          <div className="success-icon">✓</div>
          <span className="registration-eyebrow">CAMPUS EVENTS</span>
          <h1>Registration Successful!</h1>
          <p>
            You have successfully registered for <strong>{event.title}</strong>.
          </p>
          <button onClick={() => navigate("/dashboard")}>
            Go to Student Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="event-registration-page">
      <div className="registration-heading">
        <span className="registration-eyebrow">CAMPUS EVENTS</span>
        <h1>Event Registration</h1>
        <p>Complete your details and reserve your place at this event.</p>
      </div>

      <div className="registration-layout">
        <aside className="registration-event-panel">
          <div className="registration-event-icon">🎓</div>

          <span className="registration-panel-label">YOUR SELECTED EVENT</span>
          <h2>{event.title}</h2>

          <span className="registration-category">
            {event.category || "General"}
          </span>

          <div className="registration-event-details">
            <div className="registration-detail">
              <span>📅</span>
              <div>
                <small>DATE & TIME</small>
                <p>{new Date(event.eventDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="registration-detail">
              <span>📍</span>
              <div>
                <small>VENUE</small>
                <p>{event.venue || "Venue to be announced"}</p>
              </div>
            </div>

            <div className="registration-detail">
              <span>🎯</span>
              <div>
                <small>EVENT STATUS</small>
                <p>{event.status}</p>
              </div>
            </div>
          </div>

          <div className="registration-panel-note">
            <span>ℹ️</span>
            <p>Please verify your student details before submitting.</p>
          </div>
        </aside>

        <section className="registration-form-panel">
          <div className="registration-form-heading">
            <div>
              <span className="registration-eyebrow">STEP 1 · STUDENT INFORMATION</span>
              <h2>Student Details</h2>
              <p>Fill in the information below to register.</p>
            </div>
            <span className="registration-form-icon">✎</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="registration-fields">
              <div className="registration-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="registration-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="registration-field">
                <label htmlFor="studentId">Student ID / Roll Number</label>
                <input
                  id="studentId"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter your student ID"
                  required
                />
              </div>

              <div className="registration-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  required
                />
              </div>

              <div className="registration-field">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science and Engineering</option>
                  <option value="ECE">Electronics and Communication</option>
                  <option value="EEE">Electrical and Electronics</option>
                  <option value="IT">Information Technology</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="CIVIL">Civil Engineering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="registration-field">
                <label htmlFor="year">Year of Study</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            {error && <p className="registration-form-error">{error}</p>}

            <div className="registration-submit-area">
              <p>By submitting, you confirm that the details are correct.</p>

              <button
                type="submit"
                disabled={submitting || event.status !== "upcoming"}
              >
                {submitting ? "Submitting..." : "Confirm Registration →"}
              </button>

              {event.status !== "upcoming" && (
                <p className="registration-closed">
                  Registration is currently closed for this event.
                </p>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Register;
