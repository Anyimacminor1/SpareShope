# SpareShope

A full-stack e-commerce app for auto parts, built with React (frontend) and Node/Express (backend).

## Project Structure
- `client/` — React frontend
- `server/` — Node/Express backend

## Local Development
- Run `npm install` and `npm start` in both `client` and `server` folders.
- The frontend runs on port 3000, backend on port 5000 by default.

## Deployment (Render)
- Deploy `server` as a Web Service:
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `npm start`
- Deploy `client` as a Static Site:
  - Root Directory: `client`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `build`
- Set environment variables (e.g., `REACT_APP_API_URL` in frontend, DB and secrets in backend) in Render dashboard.

## API URL
- The React app uses `REACT_APP_API_URL` for backend requests. Set this in Render to your backend's public URL.

--- 