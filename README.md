# GFG Book Store – MERN Stack

Bookstore e-commerce app: browse books, sort by price, filter by price range and type, add to cart, and buy.

**Stack:** MongoDB · Express · React (Vite) · Node.js

## Setup

Requires Node 18+ and a MongoDB instance (local or Atlas).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run seed              # loads sample books
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm start                 # http://localhost:3000
```

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/books?sort=asc\|desc&min=0&max=3000&type=Fiction` | List books (all params optional) |
| GET | `/api/books/types` | Distinct book types |
| POST | `/api/orders` | Body: `{ items: [{ bookId, quantity }] }` – saves order, total computed server-side |

## Structure

```
server/   Express API + Mongoose models + seed script
client/   React UI (Vite, proxies /api to :5000)
```
