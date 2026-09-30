import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function BuyerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/bookings');

      setBookings(
        response.data.bookings || response.data
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to load your bookings.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setActionLoading(bookingId);
    setError('');
    setMessage('');

    try {
      await api.put(`/bookings/${bookingId}/cancel`);

      setMessage('Booking cancelled successfully.');
      await fetchBookings();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to cancel booking.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="seller-bookings-page">

      <section className="seller-bookings-header">

        <div className="seller-header-top">

          <div>

            <span>
              BUYER DASHBOARD
            </span>

            <h1>
              Track your
              <br />
              <em>visits.</em>
            </h1>

            <p>
              Keep track of your property visits
              and saved spaces from one place.
            </p>

          </div>

          <Link
            to="/properties"
            className="seller-add-property-button"
          >
            Explore properties
            <span>↗</span>
          </Link>

        </div>

      </section>

      <section className="seller-bookings-content">

        {message && (
          <div className="booking-success">
            {message}
          </div>
        )}

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        <div className="seller-section-heading">

          <div>
            <span>
              MY BOOKINGS
            </span>

            <h2>
              Upcoming visits
            </h2>
          </div>

          <span>
            {bookings.length} bookings
          </span>

        </div>

        {loading && (
          <div className="seller-bookings-message">
            Loading bookings...
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="seller-bookings-message">
            <h2>
              No visits booked yet.
            </h2>

            <p>
              Explore properties and book a visit
              when you find a space you like.
            </p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="seller-bookings-list">

            {bookings.map((booking) => {
              const property = booking.property;
              const isCancelled = booking.status === 'Cancelled';

              return (
                <article
                  className="seller-booking-card"
                  key={booking._id}
                >

                  <div className="seller-booking-info">

                    <span className="seller-booking-label">
                      {property?.propertyType || 'PROPERTY'}
                    </span>

                    <h3>
                      {property?.title || 'Property unavailable'}
                    </h3>

                    <p>
                      {property?.location || 'Location unavailable'}
                    </p>

                  </div>

                  <div className="seller-booking-info">

                    <span className="seller-booking-label">
                      VISIT DATE
                    </span>

                    <strong>
                      {new Date(booking.visitDate).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }
                      )}
                    </strong>

                  </div>

                  <div className="seller-booking-info">

                    <span className="seller-booking-label">
                      STATUS
                    </span>

                    <strong
                      className={`booking-status booking-status-${booking.status?.toLowerCase()}`}
                    >
                      {booking.status}
                    </strong>

                  </div>

                  <div className="seller-booking-actions">

                    {!isCancelled && booking.status !== 'Confirmed' && (
                      <button
                        type="button"
                        className="seller-booking-cancel"
                        onClick={() => handleCancel(booking._id)}
                        disabled={actionLoading === booking._id}
                      >
                        {actionLoading === booking._id
                          ? 'Cancelling...'
                          : 'Cancel'}
                      </button>
                    )}

                    {property?._id && (
                      <Link
                        to={`/properties/${property._id}`}
                        className="seller-booking-cancel"
                      >
                        View property ↗
                      </Link>
                    )}

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}

export default BuyerDashboard;
