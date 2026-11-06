import API_URL from "../api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/events/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch event.");
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
  }, [id]);

  const handleRegistration = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "student") {
      alert("Only students can register for events.");
      return;
    }

    navigate(`/register?eventId=${id}`);
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="event-details">
      <h1>{event.title}</h1>

      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Category:</strong> {event.category}</p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(event.eventDate).toLocaleString()}
      </p>

      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Capacity:</strong> {event.capacity}</p>

      <p>
        <strong>Registration Deadline:</strong>{" "}
        {new Date(event.registrationDeadline).toLocaleString()}
      </p>

      <p><strong>Status:</strong> {event.status}</p>

      <button
        onClick={handleRegistration}
        disabled={event.status !== "upcoming"}
      >
        Register for Event
      </button>
    </div>
  );
}

export default EventDetails;
