import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import api from '../services/api';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties');

        setProperties(response.data.properties || response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load properties.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <main className="properties-page">

      <section className="properties-hero">

        <span className="properties-tag">
          02 / PROPERTIES
        </span>

        <h1>
          Find your
          <br />
          <span>next space.</span>
        </h1>

        <p>
          Explore verified properties that match
          your lifestyle, location and budget.
        </p>

      </section>

      <section className="properties-section">

        <div className="properties-heading">

          <div>
            <span>
              EXPLORE LISTINGS
            </span>

            <h2>
              Available properties
            </h2>
          </div>

          <span className="property-count">
            {properties.length} properties
          </span>

        </div>

        {loading && (
          <div className="properties-message">
            Loading properties...
          </div>
        )}

        {error && (
          <div className="properties-error">
            {error}
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="properties-message">
            No properties available yet.
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="property-grid">

            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default Properties;