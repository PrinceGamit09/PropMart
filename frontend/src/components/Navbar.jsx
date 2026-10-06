import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.replace('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'Buyer') {
      return '/buyer';
    }

    if (user?.role === 'Seller') {
      return '/seller';
    }

    if (user?.role === 'Admin') {
      return '/admin';
    }

    return '/';
  };

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

        {/* Favourites are available only to Buyers */}
        {isLoggedIn && user?.role === 'Buyer' && (
          <Link to="/wishlist">
            Favourites
          </Link>
        )}

        {isLoggedIn && (
          <Link to={getDashboardPath()}>
            Dashboard
          </Link>
        )}

        <Link to="/about">
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
              onClick={handleLogout}
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