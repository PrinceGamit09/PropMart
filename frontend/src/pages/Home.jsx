function Home() {
  return (
    <main className="home-page">

      {/* HERO */}

      <section className="hero">

        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-content">

          <div className="hero-tag">
            <span className="live-dot"></span>
            PROPERTY SEARCH, REIMAGINED
          </div>

          <h1>
            Your next
            <br />
            <span>space</span> starts here.
          </h1>

          <p className="hero-description">
            Discover properties that match your lifestyle,
            budget and location.
          </p>

          {/* SEARCH */}

          <div className="search-box">

            <div className="search-icon">
              ⌕
            </div>

            <input
              type="text"
              placeholder="Search by location..."
            />

            <button>
              Search
              <span>↗</span>
            </button>

          </div>

        </div>

        {/* PROPERTY CARD */}

        <div className="floating-property-card">

          <div className="property-image">

            <span className="property-badge">
              FEATURED
            </span>

            <button className="heart-button">
              ♡
            </button>

            <div className="property-image-text">
              MODERN
              <br />
              LIVING
            </div>

          </div>

          <div className="property-info">

            <div>
              <h3>
                Skyline Residence
              </h3>

              <p>
                Vadodara · 2 BHK
              </p>
            </div>

            <strong>
              ₹40L
            </strong>

          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="stats-section">

        <div className="stat">
          <strong>2.4K+</strong>
          <span>Properties</span>
        </div>

        <div className="stat">
          <strong>18+</strong>
          <span>Cities</span>
        </div>

        <div className="stat">
          <strong>4.9</strong>
          <span>Average rating</span>
        </div>

        <div className="stat stat-message">
          <span>
            Find your
            <br />
            <b>new favorite place.</b>
          </span>

          <span className="arrow-circle">
            ↗
          </span>
        </div>

      </section>


      {/* EXPLORE */}

      <section className="discover-section">

        <div className="section-heading">

          <span className="section-number">
            01 / DISCOVER
          </span>

          <h2>
            Spaces with
            <em> personality.</em>
          </h2>

          <p>
            From minimal apartments to statement
            villas — find something that matches
            your vibe.
          </p>

        </div>


        <div className="category-grid">

          <div className="category-card category-large">

            <span>01</span>

            <h3>
              Apartments
            </h3>

            <p>
              Live your way.
            </p>

            <div className="category-arrow">
              ↗
            </div>

          </div>


          <div className="category-card category-purple">

            <span>02</span>

            <h3>
              Villas
            </h3>

            <p>
              More space. More life.
            </p>

            <div className="category-arrow">
              ↗
            </div>

          </div>


          <div className="category-card category-light">

            <span>03</span>

            <h3>
              Plots
            </h3>

            <p>
              Build something yours.
            </p>

            <div className="category-arrow">
              ↗
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;