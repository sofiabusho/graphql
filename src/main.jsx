// This is the entry point of our React application
// It's like the "main" function that starts everything

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/app.css'

// This finds the <div id="root"> in index.html and renders our App component inside it
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

