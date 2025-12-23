// App Component - The main component that controls the entire application
// This handles routing between Login and Profile pages

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import { isAuthenticated } from './utils/storage.js'
import './styles/app.css'

/**
 * App Component - Main Application Component
 * 
 * React Concepts:
 * - useState: Tracks authentication state
 * - useEffect: Checks authentication on component load
 * - React Router: Handles navigation between pages
 * - Conditional Rendering: Shows different components based on auth state
 */
function App() {
    const [authenticated, setAuthenticated] = useState(false)

    // Check if user is authenticated when app loads
    useEffect(() => {
        setAuthenticated(isAuthenticated())
    }, [])

    // Function called when login succeeds
    const handleLoginSuccess = () => {
        setAuthenticated(true)
    }

    // Function called when user logs out
    const handleLogout = () => {
        setAuthenticated(false)
    }

    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* Route for login page */}
                    <Route
                        path="/login"
                        element={
                            authenticated ? (
                                <Navigate to="/profile" replace />
                            ) : (
                                <Login onLoginSuccess={handleLoginSuccess} />
                            )
                        }
                    />

                    {/* Route for profile page */}
                    <Route
                        path="/profile"
                        element={
                            authenticated ? (
                                <Profile onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* Default route - redirect to login or profile */}
                    <Route
                        path="/"
                        element={
                            authenticated ? (
                                <Navigate to="/profile" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    )
}

export default App

