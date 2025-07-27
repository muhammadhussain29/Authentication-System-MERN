
# MERN Authentication System

A complete full-stack **MERN (MongoDB, Express.js, React, Node.js)** authentication system with essential features like user registration, login, logout, email verification via OTP, password reset via OTP, and protected user routes.

> ✅ Built with security best practices and a modern, responsive UI using React, Tailwind CSS, GSAP animations, and Node/Express backend with JWT and bcrypt.

---

## 🔐 Features

- **User Registration** with Email Verification (via OTP)
- **Login / Logout** with JWT-based session stored in cookies
- **Forgot Password** with secure OTP-based email verification
- **Password Reset** via OTP verification
- **Protected Routes** – Home page accessible only after login
- **Responsive Frontend** built with React and Tailwind CSS
- **Animations** using GSAP
- **Email Service** using Nodemailer for OTP delivery
- **Secure Password Hashing** using bcrypt
- **Context API** for global auth state management

---

## 🧰 Tech Stack

### Frontend:
- **React (Vite)**
- **Tailwind CSS**
- **GSAP** (GreenSock Animation Platform)
- **Axios**
- **React Router**
- **Context API**

### Backend:
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT (JSON Web Tokens)**
- **bcrypt.js** for hashing
- **Nodemailer** for email-based OTPs
- **cookie-parser** for handling tokens

---

## 📁 Project Structure

```
Auth-MERN/
├── Server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── Client/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── tailwind.config.js
```

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- An email account (like Gmail) to send OTPs (for Nodemailer)

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/muhammadhussain29/AUTH-MERN.git
cd AUTH-MERN
```

### 2. Setup Backend

```bash
cd server
npm install
```

#### 🔐 Create `.env` file in `Server/`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
FRONTEND_URL=http://localhost:5173
```

### 3. Run Backend

```bash
npm run server
```

---

### 4. Setup Frontend

```bash
cd ../client
npm install
```

### 5. Run Frontend

```bash
npm run dev
```

---

## 🌐 API Endpoints

### Auth Routes

| Route                  | Method | Description                           |
|------------------------|--------|---------------------------------------|
| `/api/auth/register`   | POST   | Register user                         |
| `/api/auth/login`      | POST   | Login user                            |
| `/api/auth/logout`     | GET    | Logout user                           |
| `/api/auth/verify-email` | POST | Verify user email with OTP            |
| `/api/auth/send-otp`   | POST   | Resend OTP                            |
| `/api/auth/forgot-password` | POST | Send OTP for password reset       |
| `/api/auth/reset-password` | POST | Reset password after OTP verification|

### User Routes

| Route              | Method | Description            |
|--------------------|--------|------------------------|
| `/api/user`        | GET    | Get current user data (protected) |

---

## 🔐 Security Features

- Passwords are hashed with `bcrypt` before storing in MongoDB.
- JWTs are stored in **HttpOnly cookies** to prevent XSS.
- OTPs have expiration logic and are securely generated.
- Protected routes require authentication and verified email.

---

## 📸 Screenshots

<Add screenshots here showing registration, email verification, login, home page etc.>

---

## ✍️ Author

**Muhammad Hussain Mughal**

- 🔗 [LinkedIn](https://www.linkedin.com/in/muhammad-hussain-mughal-213069248/)
- 🌐 Portfolio: *Coming Soon*

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Future Improvements

- Role-based access control (admin/user)
- Social logins (Google, Facebook)
- Rate-limiting for OTP endpoints
- Dark mode UI toggle
