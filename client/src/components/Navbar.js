import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          MicroBlog
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/feed" className="nav-link">
                Feed
              </Link>
              <Link to={`/profile/${user.username}`} className="nav-link">
                Profile
              </Link>
              <button onClick={logout} className="btn btn-secondary btn-small">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
