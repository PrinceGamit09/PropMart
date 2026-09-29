import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  const imageUrl = property.images?.[0];

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

        <button className="property-card-heart">
          ♡
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