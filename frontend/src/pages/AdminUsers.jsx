import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');

        setUsers(
          response.data.users || response.data
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load users.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="admin-users-page">

      <section className="admin-users-header">

        <Link
          to="/admin"
          className="admin-back-link"
        >
          ← Back to dashboard
        </Link>

        <span>
          ADMIN / USERS
        </span>

        <h1>
          User
          <br />
          <em>management.</em>
        </h1>

        <p>
          View registered buyers, sellers and
          administrators on the PropMart marketplace.
        </p>

      </section>

      <section className="admin-users-content">

        {loading && (
          <div className="admin-users-message">
            Loading users...
          </div>
        )}

        {error && (
          <div className="admin-users-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          users.length === 0 && (
            <div className="admin-users-message">

              <h2>
                No users found.
              </h2>

              <p>
                Registered users will appear here.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          users.length > 0 && (
            <div className="admin-users-list">

              {users.map((user) => (

                <article
                  className="admin-user-card"
                  key={user._id}
                >

                  <div className="admin-user-main">

                    <span className="admin-user-label">
                      USER
                    </span>

                    <h2>
                      {user.name}
                    </h2>

                    <p>
                      {user.email}
                    </p>

                  </div>

                  <div className="admin-user-contact">

                    <span className="admin-user-label">
                      PHONE
                    </span>

                    <strong>
                      {user.phone_no || '—'}
                    </strong>

                  </div>

                  <div className="admin-user-role">

                    <span className="admin-user-label">
                      ROLE
                    </span>

                    <strong
                      className={`admin-user-role-badge admin-user-role-${user.role?.toLowerCase()}`}
                    >
                      {user.role}
                    </strong>

                  </div>

                  <div className="admin-user-date">

                    <span className="admin-user-label">
                      JOINED
                    </span>

                    <strong>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            }
                          )
                        : '—'}
                    </strong>

                  </div>

                </article>

              ))}

            </div>
          )}

      </section>

    </main>
  );
}

export default AdminUsers;