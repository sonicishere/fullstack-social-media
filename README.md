# 🌐 Connectify — Full-Stack Social Media Platform

A modern, production-grade social networking platform built with **React** on the frontend and **Node.js/Express** on the backend. Features authentication, posts, profiles, messaging, notifications, search, and theming.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb) ![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux)

---

## ✨ Features

### 🔐 Authentication
- User registration & login with JWT tokens
- Secure password hashing with bcrypt
- Token refresh mechanism
- Protected routes & middleware
- Forgot/reset password via email

### 📝 Posts & Feed
- Create, read, update, delete posts
- Image upload support
- Like/unlike with animated interactions
- Commenting system
- Paginated feed with infinite scroll

### 👤 User Profiles
- Profile pages with cover images & avatars
- Follow/unfollow system
- Edit profile with image uploads
- User stats (posts, followers, following)
- Suggested users

### 💬 Messaging
- Real-time-style conversations
- Message bubbles (sender/receiver)
- Conversation list with previews
- Read indicators

### 🔔 Notifications
- Like, comment, follow, message notifications
- Unread badge count
- Mark as read / mark all read
- Notification panel dropdown

### 🔍 Search
- Search users by username/name
- Search posts by content/tags
- Global search bar with debounced input
- Tabbed search results

### 🎨 Theming
- Dark mode (default) & light mode
- Glassmorphism design
- Smooth theme transitions
- Preference persistence via LocalStorage

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Redux Toolkit | State management |
| React Router DOM v6 | Routing & protected routes |
| Axios | HTTP client with interceptors |
| Bootstrap 5 + Custom CSS | Styling |
| React Icons (Feather) | Iconography |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication & authorization |
| bcryptjs | Password hashing |
| Multer | File uploads |
| Nodemailer | Email sending |
| dotenv | Environment variables |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fullstack
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Configure environment variables**

Edit `server/.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

4. **Install client dependencies**
```bash
cd ../client
npm install
```

5. **Run the application**

In separate terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

6. **Open your browser** at `http://localhost:3000`

---

## 📁 Project Structure

```
fullstack/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/                # Axios instance & API modules
│   │   ├── app/                # Redux store
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/           # Login & Register forms
│   │   │   ├── common/         # Loader, Avatar, ThemeToggle
│   │   │   ├── layout/         # Navbar, Sidebar, RightPanel
│   │   │   ├── messages/       # Chat components
│   │   │   ├── notifications/  # Notification components
│   │   │   ├── posts/          # Post feed & interactions
│   │   │   ├── profile/        # Profile components
│   │   │   └── search/         # Search components
│   │   ├── features/           # Redux slices
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Route pages
│   │   ├── styles/             # CSS modules
│   │   └── utils/              # Helpers & constants
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── config/                 # DB connection
│   ├── controllers/            # Route handlers
│   ├── middleware/              # Auth, error, upload middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes
│   ├── uploads/                # File upload storage
│   └── utils/                  # Token & email helpers
│
├── .gitignore
└── README.md
```

---

## 📡 API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Register
- `POST /login` — Login
- `POST /refresh` — Refresh token
- `POST /forgot-password` — Send reset email
- `POST /reset-password/:token` — Reset password
- `GET /me` — Get current user

### Posts (`/api/posts`)
- `GET /` — Feed (paginated)
- `POST /` — Create post
- `GET /:id` — Single post
- `PUT /:id` — Update post
- `DELETE /:id` — Delete post
- `PUT /:id/like` — Toggle like
- `GET /user/:userId` — User's posts

### Users (`/api/users`)
- `GET /:id` — Profile
- `PUT /profile` — Update profile
- `PUT /:id/follow` — Follow
- `PUT /:id/unfollow` — Unfollow
- `GET /suggested` — Suggested users

### Messages (`/api/messages`)
- `GET /conversations` — List conversations
- `POST /conversations` — Create conversation
- `GET /:conversationId` — Get messages
- `POST /` — Send message

### Notifications (`/api/notifications`)
- `GET /` — List notifications
- `GET /unread-count` — Unread count
- `PUT /:id/read` — Mark read
- `PUT /read-all` — Mark all read

### Search (`/api/search`)
- `GET /users?q=` — Search users
- `GET /posts?q=` — Search posts

---

## 🎨 Design

- **Dark mode default** with light mode toggle
- **Glassmorphism** cards with backdrop blur
- **Gradient accents** (purple → teal)
- **Micro-animations** (like heart pulse, notification bounce)
- **Inter typography** from Google Fonts
- **Three-column dashboard** layout
- **Fully responsive** design

---

## 🔮 Future Enhancements

- [ ] Real-time messaging with Socket.IO
- [ ] Cloud image uploads (Cloudinary)
- [ ] Role-based access control
- [ ] Story/status feature
- [ ] Deployment (Vercel + Render)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
