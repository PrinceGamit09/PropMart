import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function SellerBookings() {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);

  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [error, setError] = useState('');
  const [propertyError, setPropertyError] = useState('');

  const [actionLoading, setActionLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setError('');

    try {
      const response = await api.get('/seller/bookings');

      setBookings(
        response.data.bookings || response.data
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to load bookings.'
      );
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchProperties = async () => {
    setLoadingProperties(true);
    setPropertyError('');

    try {
      const response = await api.get('/seller/properties');

      setProperties(
        response.data.properties || response.data
      );
    } catch (error) {
      setPropertyError(
        error.response?.data?.message ||
        'Unable to load your properties.'
      );
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProperties();
  }, []);

  const handleConfirm = async (bookingId) => {
    setActionLoading(bookingId);
    setMessage('');
    setError('');

    try {
      await api.put(
        `/seller/bookings/${bookingId}/confirm`
      );

      setMessage(
        'Booking confirmed successfully.'
      );

      fetchBookings();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to confirm booking.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId) => {
    setActionLoading(bookingId);
    setMessage('');
    setError('');

    try {
      await api.put(
        `/bookings/${bookingId}/cancel`
      );

      setMessage(
        'Booking cancelled successfully.'
      );

      fetchBookings();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to cancel booking.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this property?'
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(propertyId);
    setMessage('');
    setPropertyError('');

    try {
      await api.delete(
        `/properties/${propertyId}`
      );

      setProperties((currentProperties) =>
        currentProperties.filter(
          (property) => property._id !== propertyId
        )
      );

      setMessage(
        'Property deleted successfully.'
      );
    } catch (error) {
      setPropertyError(
        error.response?.data?.message ||
        'Unable to delete property.'
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <main className="seller-bookings-page">

      {/* ================================
          SELLER HEADER
      ================================= */}

      <section className="seller-bookings-header">

        <div className="seller-header-top">

          <div>

            <span>
              SELLER DASHBOARD
            </span>

            <h1>
              Manage
              <br />
              <em>your space.</em>
            </h1>

            <p>
              Manage your properties and
              visit requests from potential buyers.
            </p>

          </div>

          <Link
            to="/seller/add-property"
            className="seller-add-property-button"
          >
            List a property
            <span>↗</span>
          </Link>

        </div>

      </section>

      <section className="seller-bookings-content">

        {/* ================================
            GLOBAL MESSAGES
        ================================= */}

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

        {/* ================================
            MY PROPERTIES
        ================================= */}

        <div className="seller-section-heading">

          <div>

            <span>
              YOUR LISTINGS
            </span>

            <h2>
              Your properties.
            </h2>

          </div>

          <Link
            to="/seller/add-property"
            className="seller-section-link"
          >
            Add property
            <span>↗</span>
          </Link>

        </div>

        {propertyError && (
          <div className="booking-error">
            {propertyError}
          </div>
        )}

        {loadingProperties && (
          <div className="seller-bookings-message">
            Loading your properties...
          </div>
        )}

        {!loadingProperties &&
          !propertyError &&
          properties.length === 0 && (

            <div className="seller-bookings-message">

              <h2>
                No properties listed yet.
              </h2>

              <p>
                Add your first property and
                start reaching potential buyers.
              </p>

              <Link
                to="/seller/add-property"
                className="seller-add-property-secondary"
              >
                List your first property
                <span>↗</span>
              </Link>

            </div>
          )}

        {!loadingProperties &&
          !propertyError &&
          properties.length > 0 && (

            <div className="seller-properties-list">

              {properties.map((property) => (

                <article
                  className="seller-property-card"
                  key={property._id}
                >

                  {/* Property Image */}

                  <div className="seller-property-image">

                    {property.images?.[0] ? (

                      <img
                        src={property.images[0]}
                        alt={property.title}
                      />

                    ) : (

                      <div className="seller-property-placeholder">
                        {property.propertyType}
                      </div>

                    )}

                  </div>

                  {/* Property Information */}

                  <div className="seller-property-info">

                    <span className="seller-property-type">
                      {property.propertyType}
                    </span>

                    <h3>
                      {property.title}
                    </h3>

                    <p>
                      {property.location}
                    </p>

                    <div className="seller-property-details">

                      <span>
                        {property.area} sq.ft
                      </span>

                      <span>
                        {property.bedrooms || 0} Beds
                      </span>

                      <span>
                        {property.bathrooms || 0} Baths
                      </span>

                    </div>

                  </div>

                  {/* Price / Status / Actions */}

                  <div className="seller-property-side">

                    <strong>
                      ₹{property.price?.toLocaleString('en-IN')}
                    </strong>

                    <span
                      className={`seller-property-status seller-property-status-${property.status?.toLowerCase()}`}
                    >
                      {property.status}
                    </span>

                    <div className="seller-property-actions">

                      <Link
                        to={`/seller/edit-property/${property._id}`}
                        className="seller-property-edit"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="seller-property-delete"
                        onClick={() =>
                          handleDeleteProperty(
                            property._id
                          )
                        }
                        disabled={
                          deleteLoading === property._id
                        }
                      >
                        {deleteLoading === property._id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>
          )}

        {/* ================================
            VISIT REQUESTS
        ================================= */}

        <div className="seller-section-heading seller-bookings-heading">

          <div>

            <span>
              VISIT REQUESTS
            </span>

            <h2>
              Buyer requests.
            </h2>

          </div>

        </div>

        {loadingBookings && (
          <div className="seller-bookings-message">
            Loading bookings...
          </div>
        )}

        {!loadingBookings &&
          !error &&
          bookings.length === 0 && (

            <div className="seller-bookings-message">

              <h2>
                No visit requests yet.
              </h2>

              <p>
                New property visit requests
                will appear here.
              </p>

            </div>
          )}

        {!loadingBookings &&
          bookings.length > 0 && (

            <div className="seller-bookings-list">

              {bookings.map((booking) => (

                <article
                  className="seller-booking-card"
                  key={booking._id}
                >

                  <div className="seller-booking-info">

                    <span className="seller-booking-label">
                      PROPERTY
                    </span>

                    <h2>
                      {booking.property?.title ||
                        'Property'}
                    </h2>

                    <p>
                      {booking.property?.location ||
                        'Location unavailable'}
                    </p>

                  </div>

                  <div className="seller-booking-info">

                    <span className="seller-booking-label">
                      BUYER
                    </span>

                    <h3>
                      {booking.buyer?.name ||
                        'Buyer'}
                    </h3>

                    <p>
                      {booking.buyer?.email || ''}
                    </p>

                  </div>

                  <div className="seller-booking-info">

                    <span className="seller-booking-label">
                      VISIT DATE
                    </span>

                    <strong>
                      {new Date(
                        booking.visitDate
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }
                      )}
                    </strong>

                  </div>

                  <div className="seller-booking-actions">

                    <span
                      className={`booking-status booking-status-${booking.status?.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>

                    {booking.status === 'Pending' && (
                      <>

                        <button
                          type="button"
                          onClick={() =>
                            handleConfirm(
                              booking._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            booking._id
                          }
                        >
                          {actionLoading ===
                          booking._id
                            ? 'Updating...'
                            : 'Confirm'}
                        </button>

                        <button
                          type="button"
                          className="seller-booking-cancel"
                          onClick={() =>
                            handleCancel(
                              booking._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            booking._id
                          }
                        >
                          Cancel
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

export default SellerBookings;