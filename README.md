# COFIA — Explore Your Style

<p align="center">
  <strong>A modern fashion storefront for clothing, footwear, jewellery, and fragrances.</strong><br />
  Discover curated collections, browse products, and shop from one responsive experience.
</p>

<p align="center">
  <a href="https://cofia-ochre.vercel.app"><strong>Visit the live storefront →</strong></a>
</p>

## Storefront preview

<p align="center">
  <img src="screenshots/homepage.png" alt="COFIA storefront homepage" width="49%" />
  <img src="screenshots/latest-collection.png" alt="COFIA latest collection product cards" width="49%" />
</p>

<p align="center">
  <img src="screenshots/category-collections.png" alt="COFIA clothing, footwear, jewellery, and fragrance categories" width="90%" />
</p>

## Overview

COFIA is a full-stack fashion commerce project organized as three applications: a customer storefront, an admin dashboard, and a REST API. The storefront is built with React and Vite; the API uses Express and MongoDB, with Cloudinary support for image uploads.

## Features

- Browse clothing, shoes and footwear, jewellery, and perfume collections.
- Search products and view product details.
- Save favourites to a wishlist and manage a shopping cart.
- Sign in, place orders, and review order history.
- Manage products and orders through the admin dashboard.
- Responsive layouts for desktop and mobile screens.

## Technology

| Area | Technologies |
|---|---|
| Storefront and admin | React, Vite, JavaScript |
| API | Node.js, Express |
| Data | MongoDB, Mongoose |
| Product media | Cloudinary |
| Hosting | Vercel |

## Repository structure

```text
COFIA/
├── frontend/     # Customer storefront and product assets
├── admin/        # Admin dashboard
├── backend/      # Express API, routes, models, and integrations
└── screenshots/  # README preview images
```

## Run locally

### Requirements

- Node.js and npm
- MongoDB connection string
- Cloudinary account for image uploads

### Install dependencies

From the repository root, install each app's dependencies:

```powershell
cd frontend; npm install
cd ../admin; npm install
cd ../backend; npm install
```

### Configure environment variables

Create `backend/.env` using the keys in [`backend/.env.example`](backend/.env.example). For local storefront development, create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Set the same `VITE_BACKEND_URL` in `admin/.env`. Keep real credentials in local environment files; do not commit them.

### Start the applications

Open three terminals from the repository root:

```powershell
# Terminal 1: API
cd backend; npm run dev
```

```powershell
# Terminal 2: storefront
cd frontend; npm run dev
```

```powershell
# Terminal 3: admin dashboard
cd admin; npm run dev
```

Vite prints the local URLs for the storefront and admin dashboard. The API uses the configured port, or port `4000` by default.

## Deployment

The customer storefront is deployed at **[cofia-ochre.vercel.app](https://cofia-ochre.vercel.app)**. The frontend, admin dashboard, and API can be deployed as separate Vercel projects from this repository by setting each project's root directory to `frontend`, `admin`, or `backend`.

For a connected deployment:

1. Configure the backend environment variables in the API project's Vercel settings using production credentials.
2. Deploy the API and copy its production URL.
3. Set `VITE_BACKEND_URL` to that URL in the storefront and admin Vercel projects, then redeploy them.
4. Verify the storefront, sign-in, cart, and admin API connection.

Never put database passwords, JWT secrets, or Cloudinary API secrets in a `VITE_` variable; Vite exposes those values in the browser bundle.

## Security notes

- Real `.env` files are excluded from Git; only `.env.example` templates should be committed.
- Use strong production credentials and keep them in Vercel environment settings or a secure local secret store.
- Restrict database access to trusted services and rotate credentials if they are ever exposed.

## License

No license has been selected. All rights are reserved unless a license is added to this repository.
