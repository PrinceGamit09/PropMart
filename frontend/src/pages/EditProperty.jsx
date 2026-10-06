import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function EditProperty() {
  const { id } = useParams();
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

  const [currentImage, setCurrentImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(
          `/properties/${id}`
        );

        const property =
          response.data.property ||
          response.data;

        setFormData({
          title: property.title || '',
          location: property.location || '',
          price: property.price || '',
          propertyType:
            property.propertyType ||
            'Apartment',
          area: property.area || '',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          description:
            property.description || '',
          amenities:
            Array.isArray(property.amenities)
              ? property.amenities.join(', ')
              : ''
        });

        /*
         * Store the existing property image.
         */
        setCurrentImage(
          property.images?.[0] || ''
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

  /*
   * Clean up preview URL when component
   * is unmounted or preview changes.
   */
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Only allow image files.
     */
    if (!file.type.startsWith('image/')) {
      setError(
        'Please select a valid image file.'
      );

      event.target.value = '';
      return;
    }

    /*
     * Optional size limit:
     * 5 MB
     */
    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Image size must be less than 5 MB.'
      );

      event.target.value = '';
      return;
    }

    setError('');
    setSelectedImage(file);

    /*
     * Create local preview.
     */
    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      /*
       * FormData is required because
       * we are sending an image file.
       */
      const propertyData = new FormData();

      propertyData.append(
        'title',
        formData.title
      );

      propertyData.append(
        'location',
        formData.location
      );

      propertyData.append(
        'price',
        Number(formData.price)
      );

      propertyData.append(
        'propertyType',
        formData.propertyType
      );

      propertyData.append(
        'area',
        Number(formData.area)
      );

      propertyData.append(
        'bedrooms',
        formData.bedrooms
          ? Number(formData.bedrooms)
          : 0
      );

      propertyData.append(
        'bathrooms',
        formData.bathrooms
          ? Number(formData.bathrooms)
          : 0
      );

      propertyData.append(
        'description',
        formData.description
      );

      propertyData.append(
        'amenities',
        JSON.stringify(
          formData.amenities
            .split(',')
            .map((item) =>
              item.trim()
            )
            .filter(
              (item) => item !== ''
            )
        )
      );

      /*
       * Only send an image when
       * the user selected a new one.
       */
      if (selectedImage) {
        propertyData.append(
          'images',
          selectedImage
        );
      }

      await api.put(
        `/properties/${id}`,
        propertyData
      );

      setSuccess(
        'Property updated successfully.'
      );

      /*
       * Give the user time to see
       * the success message.
       */
      setTimeout(() => {
        navigate('/seller');
      }, 1500);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to update property.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="add-property-page">

        <section className="add-property-content">

          <div className="seller-bookings-message">
            Loading property...
          </div>

        </section>

      </main>
    );
  }

  if (error && !formData.title) {
    return (
      <main className="add-property-page">

        <section className="add-property-content">

          <Link
            to="/seller"
            className="admin-back-link"
          >
            ← Back to seller dashboard
          </Link>

          <div className="add-property-error">
            {error}
          </div>

        </section>

      </main>
    );
  }

  return (
    <main className="add-property-page">

      <section className="add-property-header">

        <Link
          to="/seller"
          className="admin-back-link"
        >
          ← Back to seller dashboard
        </Link>

        <span>
          SELLER / EDIT LISTING
        </span>

        <h1>
          Update your
          <br />
          <em>space.</em>
        </h1>

        <p>
          Update your property information
          and keep your listing accurate.
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
              Update the property details.
            </h2>

          </div>


          {error && (
            <div className="add-property-error">
              {error}
            </div>
          )}


          {success && (
            <div className="add-property-success">

              ✓ {success}

              <br />

              <small>
                Redirecting to your seller dashboard...
              </small>

            </div>
          )}


          {/* IMAGE SECTION */}

          <div className="edit-property-image-section">

            <div className="edit-property-image-heading">

              <div>
                <span>
                  PROPERTY IMAGE
                </span>

                <h3>
                  Update your listing image.
                </h3>
              </div>

            </div>


            <div className="edit-property-image-wrapper">

              <div className="edit-property-image-preview">

                {(imagePreview ||
                  currentImage) ? (

                  <img
                    src={
                      imagePreview ||
                      currentImage
                    }
                    alt={formData.title}
                  />

                ) : (

                  <div className="edit-property-image-placeholder">
                    {formData.propertyType}
                  </div>

                )}

              </div>


              <div className="edit-property-image-controls">

                <label
                  htmlFor="propertyImage"
                  className="edit-property-image-button"
                >
                  {selectedImage
                    ? 'Choose another image'
                    : 'Change image'}

                  <span>
                    ↗
                  </span>
                </label>

                <input
                  id="propertyImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="edit-property-file-input"
                />

                <p>
                  Upload a JPG, PNG or WEBP image.
                  Maximum size: 5 MB.
                </p>

                {selectedImage && (
                  <small className="edit-property-selected-file">
                    Selected: {selectedImage.name}
                  </small>
                )}

              </div>

            </div>

          </div>


          {/* FORM */}

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
              Updating your property keeps your
              listing information accurate.
            </p>

            <button
              type="submit"
              className="add-property-button"
              disabled={
                saving || success
              }
            >

              {saving
                ? 'Saving...'
                : success
                  ? 'Updated ✓'
                  : 'Save changes'}

              {!saving &&
                !success && (
                  <span>
                    ↗
                  </span>
                )}

            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default EditProperty;