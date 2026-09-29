import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/properties');

      setProperties(
        response.data.properties || response.data
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to load properties.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApprove = async (propertyId) => {
    setActionLoading(propertyId);
    setError('');
    setMessage('');

    try {
      await api.put(
        `/verification/${propertyId}/approve`
      );

      setMessage(
        'Property approved successfully.'
      );

      await fetchProperties();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to approve property.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (propertyId) => {
    setActionLoading(propertyId);
    setError('');
    setMessage('');

    try {
      await api.put(
        `/verification/${propertyId}/reject`
      );

      setMessage(
        'Property rejected successfully.'
      );

      await fetchProperties();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to reject property.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="admin-properties-page">

      <section className="admin-properties-header">

        <Link
          to="/admin"
          className="admin-back-link"
        >
          ← Back to dashboard
        </Link>

        <span>
          ADMIN / VERIFICATION
        </span>

        <h1>
          Review
          <br />
          <em>properties.</em>
        </h1>

        <p>
          Review seller listings before they
          become publicly available on PropMart.
        </p>

      </section>

      <section className="admin-properties-content">

        {message && (
          <div className="admin-action-success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-action-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="admin-properties-message">
            Loading properties...
          </div>
        )}

        {!loading &&
          !error &&
          properties.length === 0 && (
            <div className="admin-properties-message">

              <h2>
                No properties found.
              </h2>

              <p>
                Seller property submissions will
                appear here.
              </p>

            </div>
          )}

        {!loading &&
          properties.length > 0 && (
            <div className="admin-properties-list">

              {properties.map((property) => (

                <article
                  className="admin-property-card"
                  key={property._id}
                >

                  <div className="admin-property-main">

                    <div className="admin-property-type">
                      {property.propertyType}
                    </div>

                    <h2>
                      {property.title}
                    </h2>

                    <p className="admin-property-location">
                      {property.location}
                    </p>

                    <div className="admin-property-details">

                      <span>
                        ₹{property.price?.toLocaleString(
                          'en-IN'
                        )}
                      </span>

                      <span>
                        {property.area} sq.ft
                      </span>

                      <span>
                        {property.bedrooms || 0} Beds
                      </span>

                    </div>

                  </div>

                  <div className="admin-property-owner">

                    <span>
                      OWNER
                    </span>

                    <strong>
                      {property.owner?.name ||
                        'Seller'}
                    </strong>

                    <p>
                      {property.owner?.email || ''}
                    </p>

                  </div>

                  <div className="admin-property-status">

                    <span>
                      STATUS
                    </span>

                    <strong
                      className={`admin-status admin-status-${property.status?.toLowerCase()}`}
                    >
                      {property.status}
                    </strong>

                  </div>

                  <div className="admin-property-actions">

                    {property.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          className="admin-approve-button"
                          onClick={() =>
                            handleApprove(
                              property._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            property._id
                          }
                        >
                          {actionLoading ===
                          property._id
                            ? 'Updating...'
                            : 'Approve'}
                        </button>

                        <button
                          type="button"
                          className="admin-reject-button"
                          onClick={() =>
                            handleReject(
                              property._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            property._id
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                  </div>

                </article>

              ))}

            </div>
          )}

      </section>

    </main>
  );
}

export default AdminProperties;