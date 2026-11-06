
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      // Check login
      if (!token || !user) {
        navigate("/login");
        return;
      }

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

    fetchEvents();
  }, [navigate]);

  return (
    <section className="events">
      <h2>Upcoming Events</h2>

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p>{error}</p>
      ) : events.length === 0 ? (
        <p>No events available currently.</p>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
              title={event.title}
              date={new Date(event.eventDate).toLocaleDateString()}
              category={event.category}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Events;
