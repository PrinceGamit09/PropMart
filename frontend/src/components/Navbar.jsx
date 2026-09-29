import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        prop<span>mart</span>
      </Link>

      <div className="navbar-center">

        <Link to="/">
          Discover
        </Link>

        <Link to="/properties">
          Properties
        </Link>

        {isLoggedIn && user?.role === 'Buyer' && (
          <Link to="/wishlist">
            Wishlist
          </Link>
        )}

        <Link to="/">
          About
        </Link>

      </div>

      <div className="navbar-actions">

        {isLoggedIn ? (
          <>
            <span className="navbar-user">
              Hi, {user?.name}
            </span>

            <button
              onClick={logout}
              className="signup-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="login-link"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="signup-button"
            >
              Get started
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;