# SpareShop – Land Rover Spare Parts Website

A modern, responsive e-commerce site for Land Rover spare parts. Built with HTML5, CSS3, and vanilla JavaScript. Designed for easy future integration with backend APIs and advanced features.

## Folder Structure
```
/spare-shop
├── index.html
├── styles.css
├── script.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── neon-init.sql
├── README.md
├── assets/
│   ├── images/
│   │   ├── vehicles/
│   │   │   ├── defender-110.jpg
│   │   │   ├── series-i.jpg
│   │   │   ├── discovery-5.jpg
│   │   │   ├── range-rover-classic.jpg
│   │   │   ├── fallback.jpg
│   │   ├── parts/
│   │   │   ├── air-filter-200tdi.jpg
│   │   │   ├── air-suspension.jpg
│   │   │   ├── brake-pads.jpg
│   │   │   ├── led-headlight.jpg
│   ├── favicon/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-192x192.png
│   │   ├── favicon-512x512.png
│   │   ├── site.webmanifest
```

## 1. Neon Database Setup
1. Create a free account at [Neon](https://neon.tech/).
2. Create a new project and database.
3. Copy your connection string (e.g., `postgres://user:password@host:port/dbname`).
4. Run the SQL in `neon-init.sql` to create the `parts` table and insert sample data. You can use the Neon SQL editor or `psql` CLI.

## 2. Backend Setup (Node.js/Express)
1. Copy `.env.example` to `.env` and fill in your Neon connection string:
   ```
   DATABASE_URL=postgres://user:password@host:port/dbname
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the backend:
   ```
   npm run dev
   ```
   The backend runs on port 5000 by default and serves `/api/parts`.

## 3. Frontend Setup (Static Site)
1. Serve the frontend locally (from the project root):
   ```
   python -m http.server
   ```
   or use VS Code Live Server.
2. Open [http://localhost:8000](http://localhost:8000) in your browser.

## 4. Connecting Frontend and Backend
- By default, the frontend fetches from `/api/parts` (same origin). If you deploy backend and frontend separately, update the fetch URL in `script.js` to your Render backend URL (e.g., `https://your-backend.onrender.com/api/parts`).
- CORS is enabled in the backend for development and deployment.

## 5. Deployment to GitHub and Render
### GitHub
1. Initialize git, commit, and push to your GitHub repo:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/spareshop.git
   git branch -M main
   git push -u origin main
   ```

### Render
#### Backend (Node.js)
1. Create a new Web Service on Render from your GitHub repo.
2. Set the environment variable `DATABASE_URL` to your Neon connection string.
3. Use the default build and start commands (`npm install`, `npm start`).

#### Frontend (Static Site)
1. Create a new Static Site on Render from your GitHub repo.
2. Set the publish directory to `/` (project root).
3. If your backend is on a different domain, update the API URL in `script.js`.

## Features
- Responsive hamburger menu with ARIA accessibility
- Tabbed navigation (Home, Catalog, Cart, Contact)
- Catalog with filter by model, year, and search (dynamic from backend)
- Cart with add/remove, quantity, and localStorage persistence
- Contact form with validation
- Error handling and accessibility throughout

## Customization
- **Add more parts:** Insert into the `parts` table in Neon.
- **Add more parts:** Edit the `PARTS` array in `script.js` or connect to a backend/API.
- **Change branding:** Update colors, logo, and favicon in `styles.css` and `assets/favicon/`.
- **Add advanced features:** See TODOs below.

## TODOs / Future Features
- Backend/API integration for dynamic parts, user accounts, and orders
- Reviews, wishlist, and user login
- Payment gateway integration (e.g., Stripe)
- Advanced search (exploded views, 3D models)
- SEO enhancements

## License
MIT (or specify your own) 