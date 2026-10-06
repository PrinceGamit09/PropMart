import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  const averageRating = reviews.length
    ? Math.round(
        (reviews.reduce(
          (total, review) => total + Number(review.rating || 0),
          0
        ) / reviews.length) * 10
      ) / 10
    : 0;

  const ownReview = reviews.find((review) => {
    const buyerId = review.buyer?._id || review.buyer;
    return buyerId === user?.id;
  });

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
    if (ownReview) {
      setReviewRating(String(ownReview.rating));
      setReviewText(ownReview.comment || '');
    }
  }, [ownReview]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError('');

      try {
        const response = await api.get(`/reviews/${id}`);

        setReviews(
          response.data.reviews || response.data
        );
      } catch (error) {
        setReviewsError(
          error.response?.data?.message ||
            'Unable to load reviews.'
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
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

        const wishlist =
          response.data.wishlist || response.data;

        const wishlistItem = wishlist.find((item) => {
          const wishlistProperty =
            item.property?._id || item.property;

          return wishlistProperty === id;
        });

        setWishlisted(!!wishlistItem);
        setWishlistItemId(
          wishlistItem?._id || null
        );
      } catch (error) {
        setWishlistError(
          error.response?.data?.message ||
            'Unable to load wishlist status.'
        );
      }
    };

    fetchWishlistState();
  }, [id, isLoggedIn, user]);

  const redirectToLogin = (action) => {
    navigate('/login', {
      state: {
        from: `/properties/${id}`,
        action
      }
    });
  };

  const handleWishlist = async () => {
    setWishlistError('');

    if (!isLoggedIn) {
      redirectToLogin('save');
      return;
    }

    if (user?.role !== 'Buyer') {
      setWishlistError(
        'Only buyers can save properties.'
      );
      return;
    }

    setWishlistLoading(true);

    try {
      if (wishlisted) {
        await api.delete(
          `/wishlist/${wishlistItemId}`
        );

        setWishlisted(false);
        setWishlistItemId(null);
      } else {
        const response = await api.post('/wishlist', {
          property: id
        });

        const wishlistItem =
          response.data.wishlist || response.data;

        setWishlisted(true);
        setWishlistItemId(wishlistItem._id);
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
      redirectToLogin('booking');
      return;
    }

    if (user?.role !== 'Buyer') {
      setBookingError(
        'Only buyers can book property visits.'
      );
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

  const handleBookingButton = () => {
    setBookingMessage('');
    setBookingError('');

    if (!isLoggedIn) {
      redirectToLogin('booking');
      return;
    }

    if (user?.role !== 'Buyer') {
      setBookingError(
        'Only buyers can book property visits.'
      );
      return;
    }

    setShowBooking(!showBooking);
  };

  const handleInquiry = async (event) => {
    event.preventDefault();

    setInquiryError('');
    setInquiryMessage('');

    if (!isLoggedIn) {
      redirectToLogin('inquiry');
      return;
    }

    if (user?.role !== 'Buyer') {
      setInquiryError(
        'Only buyers can contact sellers.'
      );
      return;
    }

    setInquiryLoading(true);

    try {
      await api.post('/inquiries', {
        property: property._id,
        message: inquiryText
      });

      setInquiryMessage(
        'Your inquiry was sent to the seller.'
      );

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
      redirectToLogin('review');
      return;
    }

    if (user?.role !== 'Buyer') {
      setReviewError(
        'Only buyers can review properties.'
      );
      return;
    }

    setReviewLoading(true);

    try {
      const reviewData = {
        rating: Number(reviewRating),
        comment: reviewText
      };

      if (ownReview) {
        await api.put(
          `/reviews/${ownReview._id}`,
          reviewData
        );
      } else {
        await api.post('/reviews', {
          property: property._id,
          ...reviewData
        });
      }

      const reviewsResponse = await api.get(
        `/reviews/${id}`
      );

      setReviews(
        reviewsResponse.data.reviews ||
          reviewsResponse.data
      );

      setReviewMessage(
        ownReview
          ? 'Your review was updated successfully.'
          : 'Thanks for sharing your review.'
      );

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

  const backPath =
    isLoggedIn && user?.role === 'Seller'
      ? '/seller'
      : '/properties';

  const backLabel =
    isLoggedIn && user?.role === 'Seller'
      ? '← Back to seller dashboard'
      : '← Back to properties';

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
          <p>
            {error || 'Property not found.'}
          </p>

          <Link
            to={backPath}
            className="property-details-back-link"
          >
            {backLabel}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="property-details-page">

      <section className="property-details-hero">

        <Link
          to={backPath}
          className="property-details-back-link"
        >
          {backLabel}
        </Link>

        <div className="property-details-hero-grid">

          {/* PROPERTY IMAGE */}

          <div className="property-details-image">

            {property.images?.[0] ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="property-details-image-photo"
              />
            ) : (
              <div className="property-details-image-text">
                {property.propertyType}
              </div>
            )}

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

          </div>


          {/* PROPERTY CONTENT */}

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

            {!reviewsLoading &&
              reviews.length > 0 && (
                <div className="property-details-rating">
                  Rating - {averageRating} (
                  {reviews.length}{' '}
                  {reviews.length === 1
                    ? 'review'
                    : 'reviews'}
                  )
                </div>
              )}

            {!reviewsLoading &&
              reviews.length === 0 && (
                <div className="property-details-rating">
                  No reviews yet
                </div>
              )}

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
                onClick={handleBookingButton}
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
                {wishlisted
                  ? '♥ Saved'
                  : '♡ Save'}
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
                      setVisitDate(
                        event.target.value
                      )
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
                    : 'Confirm visit'}

                  {!bookingLoading && (
                    <span>↗</span>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </section>


      {/* PROPERTY DESCRIPTION */}

      <section className="property-description-section">

        <div className="property-information-layout">

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

            {property.amenities?.length > 0 && (
              <div className="property-amenities">

                <span>
                  AMENITIES
                </span>

                <div className="property-amenity-list">

                  {property.amenities.map(
                    (amenity) => (
                      <span key={amenity}>
                        {amenity}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

          </div>


          <div className="property-snapshot-card">

            <span>
              PROPERTY SNAPSHOT
            </span>

            <div className="property-snapshot-grid">

              <div>
                <small>
                  TYPE
                </small>

                <strong>
                  {property.propertyType}
                </strong>
              </div>

              <div>
                <small>
                  AREA
                </small>

                <strong>
                  {property.area} sq.ft
                </strong>
              </div>

              <div>
                <small>
                  BEDROOMS
                </small>

                <strong>
                  {property.bedrooms || 0}
                </strong>
              </div>

              <div>
                <small>
                  BATHROOMS
                </small>

                <strong>
                  {property.bathrooms || 0}
                </strong>
              </div>

              <div>
                <small>
                  STATUS
                </small>

                <strong>
                  {property.status}
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* REVIEWS */}

        <section className="property-reviews-section">

          <div className="property-section-heading">

            <div>

              <span>
                REVIEWS
              </span>

              <h2>
                What people think about this space.
              </h2>

            </div>

            {!reviewsLoading &&
              reviews.length > 0 && (
                <strong>
                  {averageRating}
                  <small> / 5</small>
                </strong>
              )}

          </div>


          {reviewsLoading && (
            <p className="property-section-message">
              Loading reviews...
            </p>
          )}


          {reviewsError && (
            <p className="property-section-message property-section-error">
              {reviewsError}
            </p>
          )}


          {!reviewsLoading &&
            !reviewsError &&
            reviews.length === 0 && (
              <p className="property-section-message">
                No reviews yet. Be the first to share
                your experience.
              </p>
            )}


          {!reviewsLoading &&
            !reviewsError &&
            reviews.length > 0 && (
              <div className="property-reviews-list">

                {reviews.map((review) => (

                  <article
                    className="property-review-item"
                    key={review._id}
                  >

                    <div>

                      <strong>
                        {review.buyer?.name ||
                          'Anonymous buyer'}
                      </strong>

                      <span>
                        Rating {review.rating}
                      </span>

                    </div>

                    <p>
                      {review.comment}
                    </p>

                  </article>

                ))}

              </div>
            )}

        </section>


        {/* CONTACT SELLER */}

        <section className="property-contact-section">

          <div>

            <span>
              CONTACT SELLER
            </span>

            <h2>
              Have a question about this property?
            </h2>

          </div>

          <form
            className="property-contact-form"
            onSubmit={handleInquiry}
          >

            <textarea
              id="inquiryMessage"
              value={inquiryText}
              onChange={(event) =>
                setInquiryText(event.target.value)
              }
              placeholder="Your message..."
              required
            />

            <button
              type="submit"
              className="booking-submit-button"
              disabled={inquiryLoading}
            >
              {inquiryLoading
                ? 'Sending...'
                : 'Send inquiry'}

              {!inquiryLoading && (
                <span>↗</span>
              )}
            </button>

          </form>


          {(inquiryMessage || inquiryError) && (
            <p
              className={
                inquiryError
                  ? 'booking-error'
                  : 'booking-success'
              }
            >
              {inquiryError || inquiryMessage}
            </p>
          )}

        </section>


        {/* REVIEW FORM */}

        <section
          className="property-review-form-section"
          id="property-review-form"
        >

          <div>

            <span>
              SHARE YOUR EXPERIENCE
            </span>

            <h2>
              How was your experience with this property?
            </h2>

          </div>


          <form
            className="property-review-form"
            onSubmit={handleReview}
          >

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

              <option value="5">
                5 - Excellent
              </option>

              <option value="4.5">
                4.5 - Excellent
              </option>

              <option value="4">
                4 - Very good
              </option>

              <option value="3.5">
                3.5 - Good
              </option>

              <option value="3">
                3 - Good
              </option>

              <option value="2.5">
                2.5 - Fair
              </option>

              <option value="2">
                2 - Fair
              </option>

              <option value="1.5">
                1.5 - Poor
              </option>

              <option value="1">
                1 - Poor
              </option>

            </select>


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


            <button
              type="submit"
              className="booking-submit-button"
              disabled={reviewLoading}
            >
              {reviewLoading
                ? 'Saving...'
                : ownReview
                  ? 'Update review'
                  : 'Submit review'}

              {!reviewLoading && (
                <span>↗</span>
              )}
            </button>

          </form>


          {(reviewMessage || reviewError) && (
            <p
              className={
                reviewError
                  ? 'booking-error'
                  : 'booking-success'
              }
            >
              {reviewError || reviewMessage}
            </p>
          )}

        </section>

      </section>

    </main>
  );
}

export default PropertyDetails;