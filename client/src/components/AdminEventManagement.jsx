
import { useEffect, useState } from "react";

function AdminEventManagement() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    eventDate: "",
    venue: "",
    capacity: "",
    registrationDeadline: ""
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events"
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch events.");
        return;
      }

      setEvents(data.events || []);
    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Create a new event
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            capacity: Number(formData.capacity)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Event creation failed.");
        return;
      }

      setMessage("Event created successfully!");

      setFormData({
        title: "",
        description: "",
        category: "Technical",
        eventDate: "",
        venue: "",
        capacity: "",
        registrationDeadline: ""
      });

      await fetchEvents();

    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete an event
  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Event deletion failed.");
        return;
      }

      setMessage("Event deleted successfully!");
      await fetchEvents();

    } catch (err) {
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="admin-event-management">

      <h2>Create New Event</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Technical">Technical</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
          <option value="Workshop">Workshop</option>
          <option value="Other">Other</option>
        </select>

        <label>Event Date and Time</label>
        <input
          type="datetime-local"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="venue"
          placeholder="Event Venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="capacity"
          placeholder="Maximum Participants"
          min="1"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        <label>Registration Deadline</label>
        <input
          type="datetime-local"
          name="registrationDeadline"
          value={formData.registrationDeadline}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Event"}
        </button>

      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <hr />

      <h2>Manage Events</h2>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="admin-event-list">
          {events.map((event) => (
            <div className="admin-event-card" key={event._id}>

              <h3>{event.title}</h3>

              <p>Category: {event.category}</p>

              <p>
                Date: {new Date(event.eventDate).toLocaleString()}
              </p>

              <p>Venue: {event.venue}</p>

              <p>Capacity: {event.capacity}</p>

              <p>Status: {event.status}</p>

              <button
                type="button"
                onClick={() => handleDelete(event._id)}
              >
                Delete Event
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AdminEventManagement;
