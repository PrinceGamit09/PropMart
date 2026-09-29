import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AddProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    propertyType: 'Apartment',
    area: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    amenities: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        location: formData.location,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        area: Number(formData.area),
        bedrooms: formData.bedrooms
          ? Number(formData.bedrooms)
          : 0,
        bathrooms: formData.bathrooms
          ? Number(formData.bathrooms)
          : 0,
        description: formData.description,
        amenities: formData.amenities
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== '')
      };

      await api.post('/properties', propertyData);

      setSuccess(
        '✓ Property submitted successfully. Waiting for admin approval.'
      );

      setFormData({
        title: '',
        location: '',
        price: '',
        propertyType: 'Apartment',
        area: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
        amenities: ''
      });

      setTimeout(() => {
        navigate('/seller');
      }, 3000);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to create property.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-property-page">

      <section className="add-property-header">

        <span>
          SELLER / NEW LISTING
        </span>

        <h1>
          List your
          <br />
          <em>space.</em>
        </h1>

        <p>
          Add your property to PropMart and
          let buyers discover their next space.
        </p>

      </section>

      <section className="add-property-content">

        <form
          className="add-property-form"
          onSubmit={handleSubmit}
        >

          <div className="add-property-form-heading">

            <span>
              PROPERTY INFORMATION
            </span>

            <h2>
              Tell us about the property.
            </h2>

          </div>

          {error && (
            <div className="add-property-error">
              {error}
            </div>
          )}

          {success && (
            <div className="add-property-success">
              {success}
              <br />
              <small>
                Redirecting to your seller dashboard...
              </small>
            </div>
          )}

          <div className="add-property-grid">

            <div className="form-group add-property-full">
              <label htmlFor="title">
                Property title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Modern 2 BHK Apartment"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group add-property-full">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Ahmedabad, Gujarat"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                placeholder="₹ Price"
                min="1"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">
                Property type
              </label>

              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
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

            <div className="form-group">
              <label htmlFor="area">
                Area
              </label>

              <input
                id="area"
                name="area"
                type="number"
                placeholder="Sq. ft."
                min="1"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bedrooms">
                Bedrooms
              </label>

              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                placeholder="e.g. 2"
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bathrooms">
                Bathrooms
              </label>

              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                placeholder="e.g. 2"
                min="0"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>

            <div className="form-group add-property-full">
              <label htmlFor="amenities">
                Amenities
              </label>

              <input
                id="amenities"
                name="amenities"
                type="text"
                placeholder="Parking, Gym, Garden, Security"
                value={formData.amenities}
                onChange={handleChange}
              />

              <small>
                Separate amenities with commas.
              </small>
            </div>

            <div className="form-group add-property-full">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Describe the property..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="add-property-footer">

            <p>
              Your listing will be reviewed by an admin
              before it becomes publicly visible.
            </p>

            <button
              type="submit"
              className="add-property-button"
              disabled={loading || success}
            >
              {loading
                ? 'Submitting...'
                : success
                  ? 'Submitted ✓'
                  : 'Submit property'
              }

              {!loading && !success && (
                <span>↗</span>
              )}

            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default AddProperty;