// Login Component - Handles user authentication
// This component displays a login form and manages the login process

import { useState } from 'react'
import { login } from '../services/auth.js'
import './Login.css'

/**
 * Login Component
 * 
 * React Concepts Used:
 * - useState: Manages form inputs, loading state, and error messages
 * - Event Handlers: Handles form submission and input changes
 * - Props: Receives onLoginSuccess callback from parent (App.jsx)
 * - Conditional Rendering: Shows error messages and loading states
 */
function Login({ onLoginSuccess }) {
    // State for form inputs
    const [usernameOrEmail, setUsernameOrEmail] = useState('')
    const [password, setPassword] = useState('')

    // State for loading (prevents multiple submissions)
    const [loading, setLoading] = useState(false)

    // State for error messages
    const [error, setError] = useState('')

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        // Prevent default form submission (page refresh)
        e.preventDefault()

        // Clear any previous errors
        setError('')

        // Validate inputs
        if (!usernameOrEmail.trim()) {
            setError('Please enter your username or email')
            return
        }

        if (!password) {
            setError('Please enter your password')
            return
        }

        // Set loading state (disables button, shows loading indicator), prevents multiple submissions
        setLoading(true)

        try {
            // Call the login function from auth.js
            const result = await login(usernameOrEmail.trim(), password)

            if (result.success) {
                // Login successful! Tell parent component
                onLoginSuccess()
                // Note: Navigation happens automatically via React Router
                // because App.jsx will detect authentication state change
            } else {
                // Login failed - show error message
                setError(result.error || 'Login failed. Please try again.')
            }
        } catch (err) {
            // Handle unexpected errors
            setError('An unexpected error occurred. Please try again.')
            console.error('Login error:', err)
        } finally {
            // Always reset loading state, even if login fails
            setLoading(false)
        }
    }

    /**
     * Handle input changes
     * Updates state when user types in the form fields
     */
    const handleUsernameChange = (e) => {
        setUsernameOrEmail(e.target.value)
        // Clear error when user starts typing
        if (error) setError('')
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        // Clear error when user starts typing
        if (error) setError('')
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome Back</h1>
                <p className="subtitle">Log in to view your profile</p>

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Username/Email Input */}
                    <div className="form-group">
                        <label htmlFor="username">Email or Username</label>
                        <input
                            type="text"
                            id="username"
                            value={usernameOrEmail}
                            onChange={handleUsernameChange}
                            placeholder="Enter your email or username"
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login