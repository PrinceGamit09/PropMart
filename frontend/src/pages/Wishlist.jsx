import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

function Wishlist() {
  const { isLoggedIn, user } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isLoggedIn || user?.role !== 'Buyer') {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/wishlist');

        setWishlist(
          response.data.wishlist || response.data
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load wishlist.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return (
      <main className="wishlist-page">

        <div className="wishlist-message">

          <span>YOUR WISHLIST</span>

          <h1>
            Save spaces
            <br />
            <em>you love.</em>
          </h1>

          <p>
            Log in to save properties and
            find them later.
          </p>

          <Link
            to="/login"
            className="wishlist-login-button"
          >
            Log in
            <span>↗</span>
          </Link>

        </div>

      </main>
    );
  }

  if (user?.role !== 'Buyer') {
    return (
      <main className="wishlist-page">

        <div className="wishlist-message">

          <span>WISHLIST</span>

          <h1>
            Wishlist is
            <br />
            for <em>buyers.</em>
          </h1>

          <p>
            Seller and Admin accounts cannot
            save properties.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="wishlist-page">

      <section className="wishlist-header">

        <span>
          03 / WISHLIST
        </span>

        <h1>
          Spaces you
          <br />
          <em>love.</em>
        </h1>

        <p>
          Your saved properties, all in one place.
        </p>

      </section>

      <section className="wishlist-content">

        {loading && (
          <div className="wishlist-message">
            Loading wishlist...
          </div>
        )}

        {error && (
          <div className="wishlist-error-box">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          wishlist.length === 0 && (
            <div className="wishlist-message">

              <h2>
                Nothing saved yet.
              </h2>

              <p>
                Explore properties and save the ones
                that catch your eye.
              </p>

              <Link
                to="/properties"
                className="wishlist-login-button"
              >
                Explore properties
                <span>↗</span>
              </Link>

            </div>
          )}

        {!loading &&
          !error &&
          wishlist.length > 0 && (
            <div className="property-grid">

              {wishlist.map((item) => {

                const property =
                  item.property || item;

                return (
                  <PropertyCard
                    key={item._id || property._id}
                    property={property}
                    wishlistId={item._id}
                  />
                );

              })}

            </div>
          )}

      </section>

    </main>
  );
}

export default Wishlist;