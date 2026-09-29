import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import api from '../services/api';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    minArea: '',
    maxArea: ''
  });

  const fetchProperties = async (currentFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '') {
          params[key] = value;
        }
      });

      const response = await api.get('/properties', {
        params
      });

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchProperties(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      minArea: '',
      maxArea: ''
    };

    setFilters(emptyFilters);
    fetchProperties(emptyFilters);
  };

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

        <form
          className="property-filters"
          onSubmit={handleSearch}
        >

          <div className="filter-group filter-location">

            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="Search location..."
              value={filters.location}
              onChange={handleChange}
            />

          </div>

          <div className="filter-group">

            <label htmlFor="propertyType">
              Property type
            </label>

            <select
              id="propertyType"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
            >
              <option value="">
                All types
              </option>

              <option value="Apartment">
                Apartment
              </option>

              <option value="House">
                House
              </option>

              <option value="Villa">
                Villa
              </option>

              <option value="Plot">
                Plot
              </option>

              <option value="Commercial">
                Commercial
              </option>

            </select>

          </div>

          <div className="filter-group">

            <label htmlFor="minPrice">
              Min price
            </label>

            <input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="₹ Min"
              value={filters.minPrice}
              onChange={handleChange}
            />

          </div>

          <div className="filter-group">

            <label htmlFor="maxPrice">
              Max price
            </label>

            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="₹ Max"
              value={filters.maxPrice}
              onChange={handleChange}
            />

          </div>

          <div className="filter-group">

            <label htmlFor="bedrooms">
              Bedrooms
            </label>

            <select
              id="bedrooms"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
            >
              <option value="">
                Any
              </option>

              <option value="1">
                1+
              </option>

              <option value="2">
                2+
              </option>

              <option value="3">
                3+
              </option>

              <option value="4">
                4+
              </option>

            </select>

          </div>

          <div className="filter-group">

            <label htmlFor="minArea">
              Min area
            </label>

            <input
              id="minArea"
              name="minArea"
              type="number"
              placeholder="Sq.ft"
              value={filters.minArea}
              onChange={handleChange}
            />

          </div>

          <div className="filter-group">

            <label htmlFor="maxArea">
              Max area
            </label>

            <input
              id="maxArea"
              name="maxArea"
              type="number"
              placeholder="Sq.ft"
              value={filters.maxArea}
              onChange={handleChange}
            />

          </div>

          <div className="filter-actions">

            <button
              type="submit"
              className="filter-search-button"
            >
              Search
              <span>↗</span>
            </button>

            <button
              type="button"
              className="filter-reset-button"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </form>

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

        {!loading &&
          !error &&
          properties.length === 0 && (
            <div className="properties-message">
              No properties match your filters.
            </div>
          )}

        {!loading &&
          !error &&
          properties.length > 0 && (
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