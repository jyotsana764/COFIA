# COFIA — Explore Your Style

COFIA is a full-stack fashion storefront for clothing, footwear, jewellery, and fragrances. The repository contains the customer storefront, an admin dashboard, and an Express API.

## Applications

| App | Folder | Stack | Local command |
|---|---|---|---|
| Storefront | `frontend/` | React, Vite | `npm run dev` |
| Admin dashboard | `admin/` | React, Vite | `npm run dev` |
| API | `backend/` | Node.js, Express, MongoDB | `npm run dev` |

## Features

- Product collections for clothing, shoes and footwear, jewellery, and perfume.
- Product search, category browsing, wishlist, cart, checkout, and order history.
- Admin screens for products and orders.
- MongoDB persistence and Cloudinary image storage support.
- Responsive React storefront and admin dashboard.

## Run locally

Prerequisites: Node.js with npm, a MongoDB database, and Cloudinary credentials for image uploads.

1. Clone this repository and open three terminals in its root folder.
2. Install dependencies in each application folder:

   ```powershell
   cd frontend; npm install
   cd ../admin; npm install
   cd ../backend; npm install
   ```

3. Create `backend/.env` using the variable names in `backend/.env.example`. Create `frontend/.env` with `VITE_BACKEND_URL=http://localhost:4000`. Set the same `VITE_BACKEND_URL` in `admin/.env`.
4. Start the apps in separate terminals:

   ```powershell
   # terminal 1
   cd backend; npm run dev

   # terminal 2
   cd frontend; npm run dev

   # terminal 3
   cd admin; npm run dev
   ```

Vite prints the local URLs for the storefront and admin app. The backend uses the port configured in its environment.

## Deploy on Vercel

Deploy the API and each Vite app as separate Vercel projects, all connected to the `main` branch of this repository.

1. Import the repository in Vercel and create the API project with **Root Directory** `backend`. Add the production variables from `backend/.env.example` in Vercel Project Settings → Environment Variables. Use production database and Cloudinary values; keep secrets in Vercel, never in Git.
2. Deploy the API and copy its production URL.
3. Create the storefront project with **Root Directory** `frontend`. Vercel detects Vite; use `npm run build` and `dist` if asked. Add `VITE_BACKEND_URL` with the API URL, then deploy.
4. Create the admin project with **Root Directory** `admin`. Add `VITE_BACKEND_URL` with the same API URL, then deploy.
5. Open both Vite deployment URLs and check the storefront, sign-in, cart, and admin API connection. Add the final storefront URL to the GitHub repository's **About → Website** field.

Vite environment variables are included in the built client bundle. Never put database passwords, JWT secrets, or Cloudinary API secrets in a `VITE_` variable.

## Repository layout

```text
COFIA/
├── frontend/   # Customer storefront and product images
├── admin/      # Admin dashboard
└── backend/    # Express API, routes, models, and integrations
```

## Environment files

Use the checked-in `.env.example` files as templates. Real `.env` files are excluded from Git. Never commit passwords, API keys, tokens, or production database URLs.

## License

No license has been selected yet. All rights are reserved unless a license is added to this repository.
