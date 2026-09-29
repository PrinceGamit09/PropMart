import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function PropertyDetails() {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showBooking, setShowBooking] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);

        setProperty(
          response.data.property || response.data
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load property.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBooking = async (event) => {
    event.preventDefault();

    setBookingError('');
    setBookingMessage('');

    if (!isLoggedIn) {
      setBookingError('Please log in to book a visit.');
      return;
    }

    if (user?.role !== 'Buyer') {
      setBookingError('Only buyers can book property visits.');
      return;
    }

    setBookingLoading(true);

    try {
      await api.post('/bookings', {
        property: property._id,
        visitDate
      });

      setBookingMessage(
        'Visit request sent successfully.'
      );

      setVisitDate('');
      setShowBooking(false);

    } catch (error) {
      setBookingError(
        error.response?.data?.message ||
        'Unable to book the visit.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="property-details-page">
        <div className="property-details-message">
          Loading property...
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="property-details-page">
        <div className="property-details-message">
          {error || 'Property not found.'}

          <Link to="/properties">
            Back to properties
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="property-details-page">

      <section className="property-details-hero">

        <div className="property-details-image">

          <span className="property-details-type">
            {property.propertyType}
          </span>

          <button className="property-details-heart">
            ♡
          </button>

          <div className="property-details-image-text">
            {property.propertyType}
          </div>

        </div>

        <div className="property-details-content">

          <span className="property-details-tag">
            PROPERTY DETAILS
          </span>

          <h1>
            {property.title}
          </h1>

          <p className="property-details-location">
            {property.location}
          </p>

          <div className="property-details-price">
            ₹{property.price?.toLocaleString('en-IN')}
          </div>

          <div className="property-details-stats">

            <div>
              <strong>
                {property.bedrooms || 0}
              </strong>

              <span>
                Bedrooms
              </span>
            </div>

            <div>
              <strong>
                {property.bathrooms || 0}
              </strong>

              <span>
                Bathrooms
              </span>
            </div>

            <div>
              <strong>
                {property.area}
              </strong>

              <span>
                Sq. Ft.
              </span>
            </div>

          </div>

          {bookingMessage && (
            <div className="booking-success">
              {bookingMessage}
            </div>
          )}

          {bookingError && (
            <div className="booking-error">
              {bookingError}
            </div>
          )}

          <div className="property-details-actions">

            <button
              className="property-primary-button"
              onClick={() => {
                setBookingMessage('');
                setBookingError('');

                if (!isLoggedIn) {
                  setBookingError(
                    'Please log in to book a visit.'
                  );
                  return;
                }

                if (user?.role !== 'Buyer') {
                  setBookingError(
                    'Only buyers can book property visits.'
                  );
                  return;
                }

                setShowBooking(!showBooking);
              }}
            >
              Book a visit
              <span>↗</span>
            </button>

            <button className="property-secondary-button">
              ♡ Save
            </button>

          </div>

          {showBooking && (
            <form
              className="booking-form"
              onSubmit={handleBooking}
            >

              <div className="form-group">

                <label htmlFor="visitDate">
                  Choose visit date
                </label>

                <input
                  id="visitDate"
                  type="date"
                  value={visitDate}
                  onChange={(event) =>
                    setVisitDate(event.target.value)
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split('T')[0]
                  }
                  required
                />

              </div>

              <button
                type="submit"
                className="booking-submit-button"
                disabled={bookingLoading}
              >
                {bookingLoading
                  ? 'Booking...'
                  : 'Confirm visit'
                }

                {!bookingLoading && (
                  <span>↗</span>
                )}
              </button>

            </form>
          )}

        </div>

      </section>

      <section className="property-description-section">

        <div className="property-description">

          <span>
            ABOUT THIS PROPERTY
          </span>

          <h2>
            Made for the way
            <br />
            <em>you live.</em>
          </h2>

          <p>
            {property.description ||
              'A beautiful property waiting for its next owner.'}
          </p>

        </div>

        <div className="property-info-card">

          <div>
            <span>
              PROPERTY TYPE
            </span>

            <strong>
              {property.propertyType}
            </strong>
          </div>

          <div>
            <span>
              AREA
            </span>

            <strong>
              {property.area} sq.ft
            </strong>
          </div>

          <div>
            <span>
              STATUS
            </span>

            <strong>
              {property.status}
            </strong>
          </div>

        </div>

      </section>

    </main>
  );
}

export default PropertyDetails;