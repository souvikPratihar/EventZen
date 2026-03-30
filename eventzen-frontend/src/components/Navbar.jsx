import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logoutUser, getUserRole } from '../services/authService';

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const role = getUserRole();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        EventZen
      </Link>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {!loggedIn && (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}

        {loggedIn && role === 'CUSTOMER' && (
          <>
            <Link to="/create-event" className="nav-link">
              Create Event
            </Link>
            <Link to="/profile" className="nav-link">
              My Profile
            </Link>
            <button onClick={handleLogout} className="secondary-button" type="button">
              Logout
            </button>
          </>
        )}

        {loggedIn && role === 'ADMIN' && (
          <>
            <Link to="/admin-dashboard" className="nav-link">
              Admin Dashboard
            </Link>
            <button onClick={handleLogout} className="secondary-button" type="button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;