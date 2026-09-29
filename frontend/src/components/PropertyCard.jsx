import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function PropertyCard({ property, wishlistId }) {
  const { isLoggedIn, user } = useAuth();

  const [wishlisted, setWishlisted] = useState(!!wishlistId);
  const [wishlistItemId, setWishlistItemId] = useState(
    wishlistId || null
  );
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState('');

  useEffect(() => {
    setWishlisted(!!wishlistId);
    setWishlistItemId(wishlistId || null);
  }, [wishlistId]);

  const imageUrl = property.images?.[0];

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      setWishlistError('Please log in to save properties.');
      return;
    }

    if (user?.role !== 'Buyer') {
      setWishlistError('Only buyers can save properties.');
      return;
    }

    setWishlistError('');
    setWishlistLoading(true);

    try {
      if (!wishlisted) {
        const response = await api.post('/wishlist', {
          property: property._id
        });

        const newWishlistItem =
          response.data.wishlist ||
          response.data.item ||
          response.data;

        setWishlistItemId(newWishlistItem._id);
        setWishlisted(true);
      } else {
        if (!wishlistItemId) {
          setWishlistError('Unable to remove from wishlist.');
          return;
        }

        await api.delete(`/wishlist/${wishlistItemId}`);

        setWishlisted(false);
        setWishlistItemId(null);
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

  return (
    <article className="property-card">

      <div
        className="property-card-image"
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }
            : undefined
        }
      >

        <span className="property-card-type">
          {property.propertyType}
        </span>

        <button
          className={`property-card-heart ${
            wishlisted ? 'wishlisted' : ''
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          type="button"
        >
          {wishlisted ? '♥' : '♡'}
        </button>

        {!imageUrl && (
          <div className="property-card-image-text">
            {property.propertyType}
          </div>
        )}

      </div>

      <div className="property-card-content">

        <div className="property-card-top">

          <div>
            <h3>
              {property.title}
            </h3>

            <p>
              {property.location}
            </p>
          </div>

          <strong>
            ₹{property.price?.toLocaleString('en-IN')}
          </strong>

        </div>

        <div className="property-card-details">

          <span>
            {property.bedrooms || 0} Beds
          </span>

          <span>
            {property.bathrooms || 0} Baths
          </span>

          <span>
            {property.area} sq.ft
          </span>

        </div>

        {wishlistError && (
          <p className="wishlist-error">
            {wishlistError}
          </p>
        )}

        <Link
          to={`/properties/${property._id}`}
          className="property-card-button"
        >
          View property
          <span>↗</span>
        </Link>

      </div>

    </article>
  );
}

export default PropertyCard;