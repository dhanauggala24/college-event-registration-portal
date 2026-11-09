
import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !user) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/events`);
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

  const categories = [
    "All",
    ...new Set(events.map((event) => event.category).filter(Boolean)),
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.venue?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="events-discovery">
      <section className="events-hero">
        <div className="events-hero-content">
          <span className="events-eyebrow">YOUR CAMPUS. YOUR EXPERIENCE.</span>
          <h1>Discover Amazing Campus Events</h1>
          <p>
            Explore workshops, competitions, cultural celebrations and
            unforgettable experiences happening at your college.
          </p>

          <button onClick={() => document.getElementById("event-explorer")?.scrollIntoView({ behavior: "smooth" })}>
            Explore Events <span>↓</span>
          </button>
        </div>

        <div className="events-hero-decoration" aria-hidden="true">
          <span>🎓</span>
          <span>🎤</span>
          <span>🎉</span>
        </div>
      </section>

      <section className="event-explorer" id="event-explorer">
        <div className="events-section-heading">
          <div>
            <span>FIND YOUR NEXT EXPERIENCE</span>
            <h2>Explore Events</h2>
            <p>Find something exciting to be part of.</p>
          </div>

          <div className="events-count">
            {events.length} {events.length === 1 ? "Event" : "Events"} Available
          </div>
        </div>

        <div className="events-toolbar">
          <div className="events-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search events or venues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="events-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? "selected" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="events-state">Loading exciting events...</div>
        ) : error ? (
          <div className="events-state events-error">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="events-empty">
            <div>🔎</div>
            <h3>No events found</h3>
            <p>
              {events.length === 0
                ? "There are no events available right now. Please check again later."
                : "Try another search term or select a different category."}
            </p>
            {events.length > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="event-list">
            {filteredEvents.map((event) => (
              <div className="event-list-item" key={event._id}>
                <EventCard
                  id={event._id}
                  title={event.title}
                  date={
                    event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date to be announced"
                  }
                  category={event.category}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Events;
