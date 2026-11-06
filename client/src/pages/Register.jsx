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
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "student") {
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
        const response = await fetch(
          `${API_URL}/api/events/${eventId}`
        );

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
    return <p>Loading registration form...</p>;
  }

  if (error && !event) {
    return <p className="error-message">{error}</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  if (message) {
    return (
      <div className="registration-success">
        <h1>Registration Successful!</h1>
        <p>You have successfully registered for {event.title}.</p>
        <button onClick={() => navigate("/dashboard")}>
          Go to Student Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="registration-form-container">
      <h1>Event Registration Form</h1>
      <p>Please enter your details to register for this event.</p>

      <div className="selected-event">
        <h2>{event.title}</h2>
        <p><strong>Category:</strong> {event.category}</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(event.eventDate).toLocaleString()}
        </p>
        <p><strong>Venue:</strong> {event.venue}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Student Details</h2>

        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Student ID / Roll Number</label>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="Enter your student ID"
          required
        />

        <label>Department</label>
        <select
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

        <label>Year of Study</label>
        <select
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

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          pattern="[0-9]{10}"
          title="Enter a 10-digit phone number"
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button
          type="submit"
          disabled={submitting || event.status !== "upcoming"}
        >
          {submitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}

export default Register;
