
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        <h2>CampusEvents</h2>
      </Link>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/events">Events</Link>

        {!user && (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {user?.role === "student" && (
          <>
            <Link to="/dashboard">My Dashboard</Link>
            <Link to="/login" onClick={handleLogout}>Logout</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
