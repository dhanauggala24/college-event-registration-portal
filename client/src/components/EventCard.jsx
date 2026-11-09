
import { Link } from "react-router-dom";

function EventCard({ id, title, date, category }) {
  const getCategoryIcon = () => {
    const value = category?.toLowerCase();

    if (value === "technical") return "💻";
    if (value === "cultural") return "🎭";
    if (value === "sports") return "🏆";

    return "🎉";
  };

  return (
    <article className="event-card">
      <div className="event-card-banner">
        <span className="event-card-banner-icon">
          {getCategoryIcon()}
        </span>

        <span className="event-category-badge">
          {category || "General"}
        </span>
      </div>

      <div className="event-card-content">
        <span className="event-card-label">CAMPUS EVENT</span>

        <h3>{title}</h3>

        <div className="event-card-date">
          <span>📅</span>
          <div>
            <small>EVENT DATE</small>
            <p>{date}</p>
          </div>
        </div>

        <Link to={`/events/${id}`} className="event-link">
          View Details <span>→</span>
        </Link>
      </div>
    </article>
  );
}

export default EventCard;
