
import { Link } from "react-router-dom";

function EventCard({ id, title, date, category }) {
  return (
    <div className="event-card">
      <h3>{title}</h3>

      <p>Category: {category}</p>
      <p>Date: {date}</p>

      <Link to={`/events/${id}`} className="event-link">
        View Details
      </Link>
    </div>
  );
}

export default EventCard;
