# PropMart

PropMart is a full-stack real-estate marketplace for discovering, listing, and managing properties. Buyers can browse approved listings, save properties, book visits, contact sellers, and submit reviews. Sellers can manage listings and booking requests, while administrators can manage users and verify properties.

## Technology Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs

## Project Structure

```text
PropMart/
├── src/                 # Express backend
│   ├── config/          # Database connection
│   ├── controllers/     # Application logic
│   ├── middleware/      # Authentication and role checks
│   ├── models/          # MongoDB models
│   └── routes/          # API routes
├── frontend/
│   └── src/             # React application
│       ├── components/  # Reusable UI components
│       ├── context/     # Authentication state
│       ├── pages/       # Application screens
│       └── services/    # API client
└── package.json
```

## Features

### Buyer

- Register and log in
- Browse approved properties
- Search and filter listings
- View property details
- Save and remove wishlist properties
- Book and cancel property visits
- Contact sellers
- Submit and update reviews

### Seller

- Register and log in as a seller
- Add, edit, and delete properties
- View property approval status
- View buyer visit requests
- Confirm or cancel bookings

### Admin

- View dashboard statistics
- View registered users
- Review seller property submissions
- Approve or reject properties

## Requirements

- Node.js 18 or newer
- MongoDB connection, local or MongoDB Atlas
- npm

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```

Do not commit `.env` or share its values publicly.

## Installation

Install backend dependencies from the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Run Locally

Start the backend from the project root:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The frontend runs at the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Useful Commands

Backend:

```bash
npm start       # Start the backend
npm run dev     # Start the backend with Nodemon
```

Frontend:

```bash
npm run dev     # Start Vite development server
npm run build   # Create a production build
npm run lint    # Run Oxlint
```

## Demo Flow For Viva

1. Register a Buyer and a Seller account.
2. Log in as Seller and add a property.
3. Log in as Admin and approve the property.
4. Log in as Buyer and browse the approved property.
5. Demonstrate wishlist, booking, inquiry, and review actions.
6. Return to Seller and demonstrate booking confirmation.

## Notes

- Only approved properties are visible in public property listings.
- Buyer, Seller, and Admin routes are protected by authentication and role checks.
- The project is configured for local development and college submission demonstrations.
