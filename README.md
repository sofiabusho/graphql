# GraphQL Profile Project

A React application that displays your school profile information using GraphQL queries. This project includes authentication, user profile display, and statistics visualization.

## 🎯 Project Objectives

- Learn GraphQL query language
- Create a profile page displaying user information
- Implement JWT authentication
- Build interactive SVG graphs for statistics
- Deploy the application

## 📁 Project Structure

```
graphql/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx            # Application entry point
│   ├── App.jsx             # Main app component with routing
│   ├── components/         # React components
│   │   ├── Login.jsx       # Login form component
│   │   ├── Profile.jsx     # Profile display component
│   │   ├── Statistics.jsx  # Statistics graphs (Phase 3)
│   │   ├── Login.css       # Login styles
│   │   └── Profile.css     # Profile styles
│   ├── services/           # API services
│   │   ├── auth.js         # Authentication functions
│   │   └── graphql.js      # GraphQL queries (Phase 2)
│   ├── utils/              # Utility functions
│   │   └── storage.js       # JWT token storage
│   └── styles/
│       └── app.css         # Global styles
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure your domain:
   - Open `src/services/auth.js`
   - Replace `YOUR_DOMAIN` with your actual domain (e.g., `learn.01founders.com`)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📚 Learning Guide

### Phase 1: Authentication (✅ Completed)

**What we built:**
- Login page with form handling
- JWT token storage
- Authentication service
- Routing between login and profile pages

**Key React Concepts Learned:**
- **Components**: Reusable UI pieces (Login, Profile)
- **useState**: Managing component state (form inputs, error messages)
- **useEffect**: Running code on component load
- **Event Handlers**: Handling user interactions (onSubmit, onChange)
- **JSX**: Writing HTML-like syntax in JavaScript
- **Props**: Passing data between components

**Files Created:**
- `src/components/Login.jsx` - Login form component
- `src/components/Profile.jsx` - Profile placeholder
- `src/services/auth.js` - Authentication logic
- `src/utils/storage.js` - Token management
- `src/App.jsx` - Main app with routing

### Phase 2: GraphQL Integration (Next Step)

**What we'll build:**
- GraphQL query service
- Fetching user data (XP, grades, audits, skills)
- Displaying data in Profile component

**What you'll learn:**
- GraphQL query syntax
- Making authenticated API requests
- Handling GraphQL responses
- Decoding JWT tokens

### Phase 3: Statistics & Graphs (Future)

**What we'll build:**
- SVG graph components
- XP over time graph
- Audit ratio graph
- Interactive/animated graphs

## 🔑 How Authentication Works

1. **User enters credentials** → Login form
2. **Credentials encoded** → Base64(username:password)
3. **POST request** → `/api/auth/signin` with Basic Auth
4. **Receive JWT** → Token saved to localStorage
5. **Token used** → Sent with every GraphQL request

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Next Steps

1. **Update Domain**: Edit `src/services/auth.js` and replace `YOUR_DOMAIN`
2. **Test Login**: Try logging in with your credentials
3. **Phase 2**: We'll add GraphQL queries to fetch your data
4. **Phase 3**: We'll create beautiful SVG graphs

## 🐛 Troubleshooting

**Login not working?**
- Check that you've updated `YOUR_DOMAIN` in `auth.js`
- Verify your credentials are correct
- Check browser console for error messages

**Token not saving?**
- Check browser localStorage (DevTools → Application → Local Storage)
- Ensure no browser extensions are blocking storage

## 📖 Resources

- [React Documentation](https://react.dev)
- [GraphQL Documentation](https://graphql.org/learn/)
- [JWT.io](https://jwt.io) - JWT token decoder

## 🎓 Learning Tips

- Read the comments in each file - they explain React concepts
- Experiment with the code - change values and see what happens
- Use browser DevTools to inspect components and network requests
- Ask questions when you're stuck!

---

**Happy Coding! 🚀**

