# COFIA — Explore Your Style

COFIA is a full-stack fashion storefront for clothing, footwear, jewellery, and fragrances. This repository contains the customer storefront, admin dashboard, and Express API.

## Applications

| Application | Folder | Stack |
|---|---|---|
| Storefront | `frontend/` | React, Vite |
| Admin dashboard | `admin/` | React, Vite |
| API | `backend/` | Node.js, Express, MongoDB |

## Features

- Clothing, footwear, jewellery, and perfume collections.
- Product browsing, search, wishlist, cart, checkout, and order history.
- Admin pages for product and order management.
- MongoDB persistence and Cloudinary image storage support.
- Responsive storefront and admin dashboard.

## Run locally

Prerequisites: Node.js/npm, MongoDB access, and Cloudinary credentials for image uploads.

1. Install dependencies from each application folder: run `npm install` in `frontend/`, `admin/`, and `backend/`.
2. Create `backend/.env` using the names in `backend/.env.example`. Create `frontend/.env` and `admin/.env` with `VITE_BACKEND_URL=http://localhost:4000`.
3. Start each app in a separate terminal with `npm run dev` from its folder. Vite prints the storefront and admin URLs; the API uses the port configured in its environment.

## Deploy on Vercel

Deploy the API and each Vite app as separate Vercel projects, connected to the `main` branch.

1. Import this repository and set the API project's **Root Directory** to `backend`. Add the production variables listed in `backend/.env.example` under **Settings → Environment Variables**. Keep secrets in Vercel, never in GitHub.
2. Deploy the API and copy its production URL.
3. Create the storefront project with **Root Directory** `frontend`. Use build command `npm run build`, output directory `dist`, and set `VITE_BACKEND_URL` to the API URL. Deploy.
4. Create the admin project with **Root Directory** `admin`. Set `VITE_BACKEND_URL` to the API URL and deploy.
5. Open the storefront and admin deployment URLs and verify the API connection. Add the final storefront URL in the GitHub repository's **About → Website** field.

Vite `VITE_` values are included in the browser bundle. Never put database passwords, JWT secrets, or Cloudinary API secrets in them.

## Repository layout

`frontend/` — customer storefront and product images  
`admin/` — admin dashboard  
`backend/` — API routes, controllers, models, and integrations

## Environment and security

Use checked-in `.env.example` files as templates. Real `.env` files are excluded from Git. Never commit credentials, API keys, tokens, or production database URLs.

## License

No license has been selected. All rights are reserved unless a license is added to this repository.
