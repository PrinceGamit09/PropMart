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
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');

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

  useEffect(() => {
    const fetchWishlistState = async () => {
      if (!isLoggedIn || user?.role !== 'Buyer') {
        setWishlisted(false);
        setWishlistItemId(null);
        return;
      }

      try {
        const response = await api.get('/wishlist');
        const wishlist = response.data.wishlist || response.data;
        const wishlistItem = wishlist.find((item) => {
          const wishlistProperty = item.property?._id || item.property;

          return wishlistProperty === id;
        });

        setWishlisted(!!wishlistItem);
        setWishlistItemId(wishlistItem?._id || null);
      } catch (error) {
        setWishlistError(
          error.response?.data?.message ||
          'Unable to load wishlist status.'
        );
      }
    };

    fetchWishlistState();
  }, [id, isLoggedIn, user]);

  const handleWishlist = async () => {
    setWishlistError('');

    if (!isLoggedIn) {
      setWishlistError('Please log in to save properties.');
      return;
    }

    if (user?.role !== 'Buyer') {
      setWishlistError('Only buyers can save properties.');
      return;
    }

    setWishlistLoading(true);

    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${wishlistItemId}`);
        setWishlisted(false);
        setWishlistItemId(null);
      } else {
        const response = await api.post('/wishlist', {
          property: id
        });
        const wishlist = response.data.wishlist || response.data;

        setWishlisted(true);
        setWishlistItemId(wishlist._id);
      }
    } catch (error) {
      setWishlistError(
        error.response?.data?.message ||
        'Unable to update wishlist.'
      );
    } finally {
      setWishlistLoading(false);
    }
  };

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

  const handleInquiry = async (event) => {
    event.preventDefault();

    setInquiryError('');
    setInquiryMessage('');

    if (!isLoggedIn) {
      setInquiryError('Please log in to contact the seller.');
      return;
    }

    if (user?.role !== 'Buyer') {
      setInquiryError('Only buyers can contact sellers.');
      return;
    }

    setInquiryLoading(true);

    try {
      await api.post('/inquiries', {
        property: property._id,
        message: inquiryText
      });

      setInquiryMessage('Your inquiry was sent to the seller.');
      setInquiryText('');
    } catch (error) {
      setInquiryError(
        error.response?.data?.message ||
        'Unable to send your inquiry.'
      );
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleReview = async (event) => {
    event.preventDefault();

    setReviewError('');
    setReviewMessage('');

    if (!isLoggedIn) {
      setReviewError('Please log in to review this property.');
      return;
    }

    if (user?.role !== 'Buyer') {
      setReviewError('Only buyers can review properties.');
      return;
    }

    setReviewLoading(true);

    try {
      await api.post('/reviews', {
        property: property._id,
        rating: Number(reviewRating),
        comment: reviewText
      });

      setReviewMessage('Thanks for sharing your review.');
      setReviewText('');
      setReviewRating('5');
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
        'Unable to submit your review.'
      );
    } finally {
      setReviewLoading(false);
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

          <button
            className="property-details-heart"
            onClick={handleWishlist}
            disabled={wishlistLoading}
            type="button"
          >
            {wishlisted ? '♥' : '♡'}
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

          {wishlistError && (
            <div className="booking-error">
              {wishlistError}
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

              <button
                className="property-secondary-button"
                onClick={handleWishlist}
                disabled={wishlistLoading}
                type="button"
              >
                {wishlisted ? '♥ Saved' : '♡ Save'}
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

        {isLoggedIn && user?.role === 'Buyer' && (
          <div className="property-info-card">

            <div>
              <span>
                CONTACT SELLER
              </span>

              {inquiryMessage && (
                <div className="booking-success">
                  {inquiryMessage}
                </div>
              )}

              {inquiryError && (
                <div className="booking-error">
                  {inquiryError}
                </div>
              )}

              <form
                className="booking-form"
                onSubmit={handleInquiry}
              >
                <div className="form-group">
                  <label htmlFor="inquiryMessage">
                    Your message
                  </label>

                  <textarea
                    id="inquiryMessage"
                    value={inquiryText}
                    onChange={(event) =>
                      setInquiryText(event.target.value)
                    }
                    placeholder="Ask the seller a question..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="booking-submit-button"
                  disabled={inquiryLoading}
                >
                  {inquiryLoading ? 'Sending...' : 'Send inquiry'}
                  {!inquiryLoading && <span>↗</span>}
                </button>
              </form>
            </div>

            <div>
              <span>
                SHARE YOUR EXPERIENCE
              </span>

              {reviewMessage && (
                <div className="booking-success">
                  {reviewMessage}
                </div>
              )}

              {reviewError && (
                <div className="booking-error">
                  {reviewError}
                </div>
              )}

              <form
                className="booking-form"
                onSubmit={handleReview}
              >
                <div className="form-group">
                  <label htmlFor="reviewRating">
                    Rating
                  </label>

                  <select
                    id="reviewRating"
                    value={reviewRating}
                    onChange={(event) =>
                      setReviewRating(event.target.value)
                    }
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reviewText">
                    Review
                  </label>

                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(event) =>
                      setReviewText(event.target.value)
                    }
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="booking-submit-button"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? 'Submitting...' : 'Submit review'}
                  {!reviewLoading && <span>↗</span>}
                </button>
              </form>
            </div>

          </div>
        )}

      </section>

    </main>
  );
}

export default PropertyDetails;