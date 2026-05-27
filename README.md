<![CDATA[<div align="center">

# ⚡ QuickGPT — Intelligent AI Assistant

A full-stack AI chat application powered by **Google Gemini** with text generation, AI image creation, a community gallery, and a credit-based billing system.

🔗 **Live Demo:** [quickgpt-aryan.vercel.app](https://quickgpt-aryan.vercel.app/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **AI Text Chat** | Real-time conversational AI powered by Gemini 3.5 Flash via the OpenAI-compatible API |
| 🖼️ **AI Image Generation** | Generate images from text prompts using ImageKit's AI generation engine |
| 🌍 **Community Gallery** | Publish AI-generated images for other users to browse and discover |
| 💳 **Credit System** | Purchase credits via Stripe Checkout to use text and image generation |
| 🔐 **JWT Authentication** | Secure user registration & login with hashed passwords (bcrypt) |
| 🌙 **Dark / Light Mode** | Toggle between themes with smooth transitions and persistent preference |
| 📱 **Responsive Design** | Fully responsive layout with a collapsible sidebar on mobile |
| ✍️ **Markdown Rendering** | AI responses rendered as rich Markdown with syntax-highlighted code blocks |
| 🗂️ **Chat Management** | Create, search, switch between, and delete conversation threads |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI framework
- **Vite 7** — Build tool & dev server
- **Tailwind CSS 4** — Utility-first styling
- **React Router v7** — Client-side routing
- **Axios** — HTTP client
- **react-markdown** + **Prism.js** — Markdown rendering with syntax highlighting
- **react-hot-toast** — Toast notifications
- **Moment.js** — Relative timestamps

### Backend
- **Node.js** + **Express 5** — REST API server
- **MongoDB** + **Mongoose 8** — Database & ODM
- **OpenAI SDK** — Gemini API via OpenAI-compatible endpoint
- **ImageKit** — AI image generation & media storage
- **Stripe** — Payment processing (Checkout Sessions + Webhooks)
- **JWT** + **bcryptjs** — Authentication & password hashing

### Deployment
- **Vercel** — Both client and server deployed as separate Vercel projects

---

## 📁 Project Structure

```
QUICKGPT/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── assets/                 # Icons, images, dummy data
│   │   ├── components/
│   │   │   ├── ChatBox.jsx         # Main chat interface with prompt input
│   │   │   ├── Message.jsx         # Individual message (text/image + markdown)
│   │   │   └── Sidebar.jsx         # Navigation, chat list, theme toggle
│   │   ├── context/
│   │   │   └── AppContext.jsx      # Global state (user, chats, theme, auth)
│   │   ├── pages/
│   │   │   ├── Community.jsx       # Community image gallery
│   │   │   ├── Credits.jsx         # Credit plans & Stripe purchase
│   │   │   ├── Loading.jsx         # Loading/splash screen
│   │   │   └── Login.jsx           # Login & registration form
│   │   ├── App.jsx                 # Root component with routing
│   │   └── main.jsx                # Entry point
│   ├── vercel.json                 # SPA rewrite rules for Vercel
│   └── package.json
│
├── server/                         # Express backend
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── imageKit.js             # ImageKit SDK setup
│   │   └── openai.js               # Gemini via OpenAI SDK setup
│   ├── controllers/
│   │   ├── chatController.js       # Create, list, delete chats
│   │   ├── creditController.js     # Plans & Stripe checkout session
│   │   ├── messageController.js    # Text & image message handling
│   │   ├── userController.js       # Auth, user data, published images
│   │   └── webhooks.js             # Stripe webhook handler
│   ├── middlewares/
│   │   └── auth.js                 # JWT authentication middleware
│   ├── models/
│   │   ├── Chat.js                 # Chat schema (messages array)
│   │   ├── Transaction.js          # Credit purchase transactions
│   │   └── User.js                 # User schema with password hashing
│   ├── routes/
│   │   ├── chatRoutes.js           # /api/chat/*
│   │   ├── creditRoutes.js         # /api/credit/*
│   │   ├── messageRoutes.js        # /api/message/*
│   │   └── userRoutes.js           # /api/user/*
│   ├── server.js                   # Express app entry point
│   ├── vercel.json                 # Vercel serverless config
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (Atlas cloud or local instance)
- **Stripe** account (for payments)
- **Google AI Studio** account (for Gemini API key)
- **ImageKit** account (for AI image generation)

### 1. Clone the Repository

```bash
git clone https://github.com/Aryanshettar007/QUICKGPT.git
cd QUICKGPT
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net

# Authentication
JWT_SECRET=your_jwt_secret_here

# Gemini AI (via OpenAI-compatible endpoint)
GEMINI_API_KEY=your_gemini_api_key

# ImageKit (AI Image Generation)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Stripe (Payments)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Start the server:

```bash
# Development (with hot reload)
npm run server

# Production
npm start
```

The server runs on `http://localhost:3000` by default.

### 3. Setup the Client

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_SERVER_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

The client runs on `http://localhost:5173` by default.

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/user/register` | ❌ | Register a new user |
| `POST` | `/user/login` | ❌ | Login and receive JWT |
| `GET` | `/user/data` | ✅ | Get authenticated user profile |

### Chats

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/chat/create` | ✅ | Create a new chat |
| `GET` | `/chat/get` | ✅ | Get all chats for the user |
| `POST` | `/chat/delete` | ✅ | Delete a chat by ID |

### Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/message/text` | ✅ | Send a text prompt and get AI response |
| `POST` | `/message/image` | ✅ | Generate an AI image from a prompt |

### Credits

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/credit/plan` | ❌ | Get available credit plans |
| `POST` | `/credit/purchase` | ✅ | Create a Stripe checkout session |

### Community

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/published-images` | ❌ | Get all published community images |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/stripe` | Stripe webhook for payment confirmation |

---

## 💰 Credit System

| Action | Cost |
|--------|------|
| Text generation | 1 credit |
| Image generation | 2 credits |
| New user bonus | 20 free credits |

### Available Plans

| Plan | Price | Credits |
|------|-------|---------|
| Basic | $10 | 100 credits |
| Pro | $20 | 500 credits |
| Premium | $30 | 1,000 credits |

---

## 🌐 Deployment (Vercel)

Both client and server are deployed as separate Vercel projects.

### Server Deployment

1. Import the `server/` directory into Vercel
2. Set all environment variables from `.env` in the Vercel dashboard
3. The `vercel.json` routes all requests to `server.js`

### Client Deployment

1. Import the `client/` directory into Vercel
2. Set `VITE_SERVER_URL` to your deployed server URL (e.g., `https://quickgpt-server.vercel.app`)
3. The `vercel.json` configures SPA rewrites for client-side routing

### Stripe Webhook Setup

1. In the Stripe Dashboard, add a webhook endpoint pointing to `https://your-server-url/api/stripe`
2. Listen for events: `payment_intent.succeeded`, `checkout.session.completed`
3. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">

**Built with ❤️ by [Aryan](https://github.com/Aryanshettar007)**

</div>
]]>
