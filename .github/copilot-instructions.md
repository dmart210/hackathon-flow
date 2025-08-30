# Copilot Instructions for AI Coding Agents

## Project Overview
- This backend simulates restaurant inventory and waste management for "WagaWaste-Watch".
- The current architecture is a single Node.js Express server (`server.js`) with in-memory state. Future plans include a modular REST API and PostgreSQL database via Docker.

## Key Files & Structure
- `server.js`: Main entry point. Contains Express setup, simulation logic, and `/api/data` endpoint.
- `docker-compose.yml` (planned): Will define PostgreSQL service for persistent data.
- `db.js`, `routes/` (planned): For modular database access and API routing.
- `README.md`: Currently empty; update with setup and usage instructions as the project evolves.

## Developer Workflows
- **Start server:**
  - From `backend/hackathon-flow/`, run: `node server.js`
- **Install dependencies:**
  - Use `npm install express cors` for the current simulation.
  - Future: Add `pg` for PostgreSQL integration.
- **Database setup (future):**
  - Use `docker-compose up -d` to start PostgreSQL.
  - Connect using credentials in `docker-compose.yml`.

## Patterns & Conventions
- **State management:**
  - All simulation data is held in a single `state` object in-memory.
  - Inventory and waste are updated every 2 seconds via `setInterval`.
- **API design:**
  - Single endpoint `/api/data` returns the full state.
  - Future endpoints will be modular (e.g., `/api/inventory`, `/api/waste`).
- **Error handling:**
  - Minimal in current code; future routes should use try/catch and return JSON errors.
- **Directory structure:**
  - All backend code is inside `backend/hackathon-flow/`.
  - Place `.github/copilot-instructions.md` here for agent guidance.

## Integration Points
- **Frontend:**
  - Designed to be consumed by a frontend via HTTP requests (CORS enabled).
- **Database:**
  - Planned integration with PostgreSQL using Docker and the `pg` library.

## Example Patterns
- Simulation logic:
  ```js
  setInterval(() => {
    // ...update state...
  }, 2000);
  ```
- API endpoint:
  ```js
  app.get('/api/data', (req, res) => {
    res.json(state);
  });
  ```

## Guidance for AI Agents
- Always check `server.js` for the latest simulation and API logic.
- If adding database features, follow the modular pattern: separate `db.js` for connections, `routes/` for endpoints.
- Update this file as new architectural components are added.

---

*Please review and suggest edits if any section is unclear or missing important project-specific details.*
