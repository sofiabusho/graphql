# GraphQL Profile Project

A modern, interactive profile page that displays your school information using GraphQL queries. This project demonstrates GraphQL querying, JWT authentication, and SVG-based data visualization.

**Built with vanilla JavaScript, HTML, and CSS** - no React, no Node.js, no build tools required!

## Project Objectives

- Learn GraphQL query language
- Create a profile page displaying user information
- Implement JWT authentication
- Build interactive SVG graphs for statistics
- Deploy the application

## Project Structure

```
graphql/
├── index.html          # Main HTML file
├── styles.css           # All CSS styles
├── app.js              # All JavaScript functionality
└── README.md
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A web server (for local development) or just open `index.html` directly
- Access to the Zone01 platform API

### Installation

1. **Clone or download this repository**

2. **Open the project:**

##  Deployment



## Features

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
- **XP by Project**
- **XP by Latest Activity (Top 5)**: 
- **Audit Ratio**

All charts are interactive SVG visualizations with smooth animations.

## How Authentication Works

1. **User enters credentials** → Login form
2. **Credentials encoded** → Base64(username:password)
3. **POST request** → `/api/auth/signin` with Basic Auth
4. **Receive JWT** → Token saved to localStorage
5. **Token used** → Sent with every GraphQL request

## Technical Details

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

## File Structure Explained

- **index.html**: Contains the login and profile page structure
- **styles.css**: All CSS styles for login, profile, and charts
- **app.js**: Contains all JavaScript code organized into modules:
  - `storage`: Token management utilities
  - `auth`: Authentication functions
  - `graphql`: GraphQL query functions
  - `ui`: DOM manipulation and chart rendering
  - `app`: Main application logic


---


