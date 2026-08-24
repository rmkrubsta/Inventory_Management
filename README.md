# AssetFlow Enterprise

MERN foundation for the Enterprise Asset & Inventory Lifecycle Management System.

## Run locally

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies with `npm run install:all`.
3. Start the API and React app with `npm run dev`.
4. Open `http://localhost:5173`.

The React dashboard uses demo assets until the API returns stored records. MongoDB is required for the Express API to start.

## Environment variable policy

`.env.example` documents the required names only. Create `.env` locally from it when developing, but never commit `.env` or real credentials. The server reads values from `process.env`; `dotenv` loads the local `.env` file when one exists.

For GitHub Actions or deployment, do not create or commit a production `.env` file. Add these values in GitHub repository/environment settings and inject them into the job or hosting service:

- `MONGODB_URI`: MongoDB Atlas connection string. Store as a GitHub **secret**.
- `PORT`: API port, usually `5000`. Store as a GitHub **variable** or let the host provide it.
- `CLIENT_URL`: deployed React client URL. Store as a GitHub **variable**.

For GitHub Codespaces, add `MONGODB_URI` under repository Codespaces secrets, then rebuild or restart the Codespace. GitHub will expose it as an environment variable; the application does not need to know whether it came from `.env`, Codespaces, Actions, or the hosting provider.