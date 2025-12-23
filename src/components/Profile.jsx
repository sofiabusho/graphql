// Profile Component - Displays user information from GraphQL
// This component fetches user data from GraphQL and displays it

import { useState, useEffect } from 'react'
import { logout } from '../services/auth.js'
import { getToken, isCurrentTokenExpired } from '../utils/storage.js'
import { getAllUserData } from '../services/graphql.js'
import './Profile.css'
import Statistics from './Statistics.jsx'


/**
 * Profile Component
 * 
 * React Concepts:
 * - useEffect: Runs code when component loads (like on page load)
 * - useState: Stores user data, loading and error states
 * - Props: Receives onLogout function from parent
 * - Conditional Rendering: Shows different UI based on state
 * - Error Handling: Displays error messages to user
 */
function Profile({ onLogout }) {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // useEffect runs after the component is rendered
    // The empty array [] means it only runs once (when component first loads)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const token = getToken()
                if (!token) {
                    throw new Error('No authentication token found')
                }

                // Check if token is expired before making request
                if (isCurrentTokenExpired()) {
                    throw new Error('JWT_EXPIRED')
                }
                // If token is valid, fetch user data
                const data = await getAllUserData(token)
                setUserData(data)
            } catch (err) {
                console.error('Failed to fetch user data:', err)

                // Check if it's a JWT expiration error
                const errorMessage = err.message || ''
                if (errorMessage.includes('JWTExpired') || errorMessage.includes('JWT_EXPIRED') || errorMessage === 'JWT_EXPIRED') {
                    setError('JWT_EXPIRED')
                } else {
                    setError(err.message || 'Failed to load profile data')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Handle logout and redirect when token is expired
    const handleExpiredToken = () => {
        logout()
        onLogout()
    }

    const handleLogout = () => {
        logout()
        onLogout() // Tell parent component to switch back to login
    }

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
                <div className="loading">
                    <div className="loading-spinner">Loading profile data...</div>
                </div>
            </div>
        )
    }

    // Update the error state rendering:
    if (error) {
        const isExpired = error === 'JWT_EXPIRED' || error.includes('JWTExpired')

        return (
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
                <div className="error-state">
                    <h2>Session Expired</h2>
                    {isExpired ? (
                        <>
                            <p>Your session has expired. Please log in again to continue.</p>
                            <button
                                onClick={handleExpiredToken}
                                className="retry-button"
                            >
                                Go to Login
                            </button>
                        </>
                    ) : (
                        <>
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="retry-button"
                            >
                                Retry
                            </button>
                        </>
                    )}
                </div>
            </div>
        )
    }


    // No data state
    if (!userData) {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
                <div className="error-state">
                    <p>No data available</p>
                </div>
            </div>
        )
    }

    // Main profile display
    const { user, xp, skills, audit, projects, piscine, technologies } = userData

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            <div className="profile-content">
                {/* User Information Card */}
                <div className="profile-card">
                    <h2> User Information</h2>
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{user?.name || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Login:</span>
                        <span className="info-value">{user?.login || 'N/A'}</span>
                    </div>
                    {user?.email && (
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user.email}</span>
                        </div>
                    )}
                </div>

                {/* XP Card */}
                <div className="profile-card">
                    <h2> Total XP (div-01)</h2>
                    <div className="xp-display">
                        <span className="xp-value">{xp?.total?.toLocaleString() || 0}</span>
                        <span className="xp-label">XP Points</span>
                    </div>
                </div>


                {/* Skills Card */}
                <div className="profile-card">
                    <h2> Top Skills</h2>
                    {skills?.skills && skills.skills.length > 0 ? (
                        <div className="skills-list">
                            {skills.skills.map((skill) => (
                                <div key={skill.id} className="skill-item">
                                    <span className="skill-name">{skill.name}</span>
                                    <span className="skill-amount">{skill.amount} %</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="info-text">
                            {skills?.error || 'No skills data available'}
                        </p>
                    )}
                </div>

                {/* Audit Ratio Card */}
                <div className="profile-card">
                    <h2> Audit Ratio</h2>
                    {audit && (
                        <div className="audit-display">
                            <div className="audit-ratio">
                                <span className="audit-value">{audit.ratio}</span>
                            </div>
                            <div className="audit-details">
                                <div className="audit-item">
                                    <span className="audit-label">Done:</span>
                                    <span className="audit-number">{audit.up}</span>
                                </div>
                                <div className="audit-item">
                                    <span className="audit-label">Received:</span>
                                    <span className="audit-number">{audit.down}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Statistics Section */}
                <div className="profile-card statistics-section">
                    <Statistics
                        projects={projects}
                        piscine={piscine}
                        technologies={technologies}
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile