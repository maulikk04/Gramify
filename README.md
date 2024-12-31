# Gramify 📱
A modern social media platform built with React, TypeScript, and Firebase.

## Features ✨
### Authentication & Profile
- 🔐 User login/signup with email verification
- 🔑 Forgot password and reset functionality
- 👤 Customizable profile page
- 🔄 Profile updates
- 🔒 Private profile option

### Social Features
- 📝 Create posts
- ❤️ Like, comment, and bookmark posts
- 👥 Follow/unfollow users
- 💬 Real-time chat
- 🔍 Post filtering by username and caption

### Privacy & Notifications
- 🔒 Private profile with follower approval system
- 🔔 Customizable notifications for:
  - Likes and comments
  - Follow/unfollow actions
  - New posts from following
  - Follow requests

### Security Features
- ✉️ Email verification required after signup
- 🔐 Secure password reset process via email
- 🛡️ Protected routes for verified users only

## Tech Stack 🚀
### Frontend
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/UI](https://ui.shadcn.com/) - Component library

### Backend
- [Firebase](https://firebase.google.com/) - Backend services
- [Uploadcare](https://uploadcare.com/) - Media handling

## Setup 🛠️
1. Clone the repository:
```bash
git init
git remote add origin https://github.com/maulikk04/Gramify.git
```

2. Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_APIKEY=
VITE_AUTHDOMAIN=
VITE_PROJECTID=
VITE_STORAGEBUCKET=
VITE_MESSAGINGSENDERID=
VITE_APPID=

# Uploadcare API
VITE_UPLOADCAREKEY=
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Demo 🎥
[Watch Demo Video](https://drive.google.com/file/d/17njtWCZ9abTkSddMo_Q6p6bMAsE-Zb1C/view?usp=sharing)
