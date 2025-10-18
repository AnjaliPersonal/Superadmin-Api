# Superadmin Backend (MySQL + Sequelize)

## Quick start

1. Copy `.env.example` to `.env` and update DB credentials and `JWT_SECRET`.
2. Install dependencies:
   ```
   npm install
   ```
3. Run in development:
   ```
   npm run dev
   ```
4. API endpoints:
   - `POST /api/auth/register` - register user (body: name, email, password, role)
   - `POST /api/auth/login` - login (body: email, password)
   - `GET /api/users` - list users (requires authorization, role: superadmin or admin)

This scaffold includes:
- Express app
- Sequelize + MySQL connection
- JWT auth (register/login)
- Role-based middleware
- Migration script template to import users.json exported from MongoDB
