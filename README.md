# GraphQL Profile Project

A modern, interactive profile page that displays your school information using GraphQL queries. This project demonstrates GraphQL querying, JWT authentication, and SVG-based data visualization.

**Built with vanilla JavaScript, HTML, and CSS** - no React, no Node.js, no build tools required!

## 🎯 Project Objectives

- Learn GraphQL query language
- Create a profile page displaying user information
- Implement JWT authentication
- Build interactive SVG graphs for statistics
- Deploy the application

## 📁 Project Structure

```
graphql/
├── index.html          # Main HTML file
├── styles.css           # All CSS styles
├── app.js              # All JavaScript functionality
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A web server (for local development) or just open `index.html` directly
- Access to the Zone01 platform API

### Installation

1. **Clone or download this repository**

2. **Open the project:**
   - **Option 1 (Recommended)**: Use a local web server
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server -p 8000
     ```
     Then open `http://localhost:8000` in your browser
   
   - **Option 2**: Simply open `index.html` directly in your browser
     - Note: Some browsers may block CORS requests when opening files directly
     - For production, always use a web server

3. **Configure the domain** (if needed):
   - The domain is set to `platform.zone01.gr` in `app.js`
   - If you need to change it, edit the `DOMAIN` constant in `app.js`

## 📚 Features

### Authentication
- Login with username/email and password
- JWT token storage in browser localStorage
- Automatic token expiration checking
- Secure logout functionality

### Profile Display
- **Student Information**: Name, login, email
- **Total XP**: XP points earned in div-01
- **Audit Ratio**: Done vs Received audits
- **Top Skills**: Top 5 skills with percentages

### Statistics & Visualizations
- **XP by Project**: Horizontal bar chart showing XP earned per project
- **Piscine Stats**: 
  - Pass/Fail ratio donut chart
  - Exercise attempts bar chart
- **Technologies**: Horizontal bar chart showing XP by technology

All charts are interactive SVG visualizations with smooth animations.

## 🔑 How Authentication Works

1. **User enters credentials** → Login form
2. **Credentials encoded** → Base64(username:password)
3. **POST request** → `/api/auth/signin` with Basic Auth
4. **Receive JWT** → Token saved to localStorage
5. **Token used** → Sent with every GraphQL request

## 🛠️ Technical Details

### GraphQL Queries
The app uses several GraphQL queries to fetch:
- User information (name, login, email)
- XP transactions (total and by project)
- Skills data
- Audit ratios
- Piscine progress
- Technology usage

### SVG Charts
All charts are created using vanilla JavaScript and SVG:
- Dynamic SVG element creation
- Smooth animations using SVG `<animate>` elements
- Responsive design with viewBox
- Interactive hover effects

### No Dependencies
This project uses only:
- **HTML5** for structure
- **CSS3** for styling
- **Vanilla JavaScript (ES6+)** for functionality
- **SVG** for data visualization

No frameworks, no build tools, no package managers required!

## 📝 File Structure Explained

- **index.html**: Contains the login and profile page structure
- **styles.css**: All CSS styles for login, profile, and charts
- **app.js**: Contains all JavaScript code organized into modules:
  - `storage`: Token management utilities
  - `auth`: Authentication functions
  - `graphql`: GraphQL query functions
  - `ui`: DOM manipulation and chart rendering
  - `app`: Main application logic

## 🐛 Troubleshooting

**Login not working?**
- Check that you have internet connection
- Verify your credentials are correct
- Check browser console for error messages (F12 → Console)
- Ensure CORS is not blocking requests (use a web server, not file://)

**Token not saving?**
- Check browser localStorage (DevTools → Application → Local Storage)
- Ensure no browser extensions are blocking storage
- Try a different browser

**Charts not displaying?**
- Check browser console for JavaScript errors
- Ensure GraphQL queries are returning data
- Verify SVG support in your browser

**CORS errors?**
- Always use a web server, not file:// protocol
- The API must allow requests from your origin
- Check browser console for specific CORS error messages

## 📖 Resources

- [GraphQL Documentation](https://graphql.org/learn/)
- [JWT.io](https://jwt.io) - JWT token decoder
- [MDN Web Docs](https://developer.mozilla.org/) - HTML, CSS, JavaScript reference
- [SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)

## 🎓 Learning Tips

- Open browser DevTools (F12) to see network requests and console logs
- Inspect the GraphQL queries in `app.js` to understand the data structure
- Experiment with the SVG chart code to customize visualizations
- Check localStorage to see how JWT tokens are stored
- Read the comments in `app.js` to understand each function

## 🌐 Deployment

To deploy this project:

1. **Static Hosting**: Upload `index.html`, `styles.css`, and `app.js` to any static hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3
   - Any web server

2. **No Build Step Required**: Since it's vanilla JS, just upload the files!

3. **HTTPS Required**: For production, ensure your site uses HTTPS (required for secure API calls)

---

**Happy Coding! 🚀**
