import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');

        setStatistics(
          response.data.statistics || {}
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load admin dashboard.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <div className="admin-dashboard-message">
          Loading dashboard...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-dashboard-page">
        <div className="admin-dashboard-message admin-dashboard-error">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">

      <section className="admin-dashboard-header">

        <span>
          ADMIN / OVERVIEW
        </span>

        <h1>
          Control
          <br />
          <em>center.</em>
        </h1>

        <p>
          Manage users, properties and
          marketplace activity from one place.
        </p>

      </section>

      <section className="admin-dashboard-content">

        <div className="admin-stat-grid">

          <div className="admin-stat-card">
            <span>
              TOTAL USERS
            </span>

            <strong>
              {statistics?.totalUsers ?? 0}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>
              TOTAL PROPERTIES
            </span>

            <strong>
              {statistics?.totalProperties ?? 0}
            </strong>
          </div>

          <Link
            to="/admin/properties"
            className="admin-stat-card admin-stat-link"
          >
            <span>
              PENDING PROPERTIES
            </span>

            <strong>
              {statistics?.pendingProperties ?? 0}
            </strong>

            <small>
              Review properties ↗
            </small>
          </Link>

          <div className="admin-stat-card">
            <span>
              APPROVED PROPERTIES
            </span>

            <strong>
              {statistics?.approvedProperties ?? 0}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>
              TOTAL BOOKINGS
            </span>

            <strong>
              {statistics?.totalBookings ?? 0}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>
              TOTAL REVIEWS
            </span>

            <strong>
              {statistics?.totalReviews ?? 0}
            </strong>
          </div>

        </div>

        <div className="admin-dashboard-section">

          <div>
            <span className="admin-section-label">
              MANAGEMENT
            </span>

            <h2>
              Marketplace controls
            </h2>
          </div>

          <div className="admin-management-grid">

            <Link
              to="/admin/properties"
              className="admin-management-card admin-management-link"
            >
              <span>
                01
              </span>

              <h3>
                Property verification
              </h3>

              <p>
                Review properties submitted
                by sellers and approve or reject
                them.
              </p>

              <strong>
                Review properties ↗
              </strong>
            </Link>

            <Link
              to="/admin/users"
              className="admin-management-card admin-management-link"
            >
              <span>
                02
              </span>

              <h3>
                User management
              </h3>

              <p>
                View registered buyers,
                sellers and administrators.
              </p>

              <strong>
                View users ↗
              </strong>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;