import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_no: '',
    password: '',
    role: 'Buyer'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/register', formData);

      setSuccess(
        'Account created successfully. Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page register-page">

      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-container">

        <div className="login-intro">

          <span className="login-tag">
            JOIN PROPMART
          </span>

          <h1>
            Find your
            <br />
            <span>next space.</span>
          </h1>

          <p>
            Create your account and start discovering
            properties that fit your lifestyle.
          </p>

        </div>

        <div className="login-card">

          <div className="login-card-header">

            <h2>
              Create account
            </h2>

            <p>
              Join the PropMart marketplace.
            </p>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {success && (
            <div className="login-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

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

              <label htmlFor="phone_no">
                Phone number
              </label>

              <input
                id="phone_no"
                name="phone_no"
                type="tel"
                placeholder="10-digit phone number"
                value={formData.phone_no}
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
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="role">
                I want to
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Buyer">
                  Buy / find a property
                </option>

                <option value="Seller">
                  Sell / list a property
                </option>
              </select>

            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create account'
              }

              {!loading && (
                <span>↗</span>
              )}
            </button>

          </form>

          <div className="login-footer">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Log in
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Register;