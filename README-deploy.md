Deployment notes
----------------

Backend (Render):
- Use the provided `render.yaml` to create a web service in Render. Replace `REPLACE_WITH_YOUR_GIT_REPO_URL` with your repo URL.
- Set the required environment variables in the Render dashboard (MONGODB_URI, JWT_SECRET, CLOUDINARY_* etc.).
- Render will run `npm install` and `npm start` as configured in `render.yaml`.

Frontend (Vercel):
- In Vercel, create a new project and point it to the `frontend` directory of this repo.
- Set the Vite environment variables under Project > Settings > Environment Variables (e.g. VITE_BACKEND_URL).
- Vercel will run `npm --prefix frontend run build` and deploy the static `dist`.

Notes:
- Keep secrets out of the repo. Use platform environment variables.
- Ensure the front-end `VITE_BACKEND_URL` points to your Render service URL (e.g. https://your-render-service.onrender.com).
