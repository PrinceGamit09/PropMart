import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const returnPath = location.state?.from;
  const action = location.state?.action;

  const getActionMessage = () => {
    if (action === 'booking') {
      return 'Log in to book a property visit.';
    }

    if (action === 'save') {
      return 'Log in to save this property.';
    }

    if (action === 'inquiry') {
      return 'Log in to contact the seller.';
    }

    if (action === 'review') {
      return 'Log in to review this property.';
    }

    return 'Welcome back to PropMart.';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await api.post(
        '/login',
        formData
      );

      const { token, user } = response.data;

      login(user, token);

      if (returnPath) {
        navigate(returnPath, {
          replace: true
        });
        return;
      }

      if (user.role === 'Admin') {
        navigate('/admin', {
          replace: true
        });
      } else if (user.role === 'Seller') {
        navigate('/seller', {
          replace: true
        });
      } else {
        navigate('/buyer', {
          replace: true
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-container">
        <div className="login-intro">
          <span className="login-tag">
            WELCOME BACK
          </span>

          <h1>
            Your space
            <br />
            is waiting.
          </h1>

          <p>
            Sign in to discover properties,
            manage your listings and find
            your next place.
          </p>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Log in</h2>

            <p>
              {getActionMessage()}
            </p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? 'Logging in...'
                : 'Log in'}

              {!loading && <span>↗</span>}
            </button>
          </form>

          <div className="login-footer">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;