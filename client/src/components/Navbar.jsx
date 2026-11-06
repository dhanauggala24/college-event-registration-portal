
import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav className="navbar">
      <h2>CampusEvents</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/register">Register</Link>

        {user?.role === "admin" && (
          <Link to="/admin-dashboard">Admin Dashboard</Link>
        )}

<Link to="/login">Login</Link>

<Link to="/admin-dashboard">Admin Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;
