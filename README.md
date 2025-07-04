# ⭐ Rating Platform

A full-stack rating and review platform allowing users to rate stores, store owners to view their store ratings, and admins to manage users, stores, and ratings. Built with **Node.js**, **Express**, **Prisma**, **PostgreSQL**, **React (Vite)**, **Tailwind CSS**, and **Framer Motion**.

---

## 📸 Features

- **User Authentication**
  - Signup and login with JWT-based authentication
  - Password change functionality for users and store owners
- **Role-Based Dashboards**
  - **Admin Dashboard**:
    - View total users, stores, and ratings
    - Add new users and stores (with optional store images)
    - Search and filter users by name, email, address, or role
    - Search and filter stores by name, email, or address
    - View store images and average ratings
  - **Store Owner Dashboard**:
    - View store details, image, and average rating
    - Access all customer ratings for their store
  - **User Dashboard**:
    - Browse all stores
    - Submit or update star ratings for stores
- **UI/UX Enhancements**
  - Responsive design with Tailwind CSS
  - Smooth animations using Framer Motion
  - Toast notifications with `react-toastify`
  - Customizable store images (default image if none provided)

---

## 📂 Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Framer Motion
- React Icons0
- Axios
- React Toastify

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- Bcrypt
- dotenv

---

## 📦 Setup Instructions (Local Development)

### 📥 1. Clone the Repository

```bash
git clone https://github.com/your-username/rating-platform.git
cd rating-platform
```

### 🛠️ 2. Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` file in the `Backend/` directory with the following:
   ```env
    setup the .env file
   ```
4. Run Prisma migrations to set up the database:
   ```bash
   npx prisma migrate dev --name init_schema
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 🎨 3. Setup Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` file in the `Frontend/` directory with the following:
   ```env
    setup the .env file
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 🚀 4. Access the Application

- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:5000/api/](http://localhost:5000/api/)

---
