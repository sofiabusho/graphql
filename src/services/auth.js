// Authentication service - handles login and logout
// This communicates with the API to authenticate users

import { saveToken, removeToken } from '../utils/storage.js'

const DOMAIN = 'platform.zone01.gr' 
// Use proxy in development, direct URL in production
const isDevelopment = import.meta.env.DEV
const SIGNIN_URL = isDevelopment
    ? '/api/auth/signin'  // Uses Vite proxy (no CORS issues)
    : `https://${DOMAIN}/api/auth/signin`  // Direct URL in production

/**
 * Login function - authenticates user and saves JWT token
 * @param {string} usernameOrEmail - Username or email address
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, token?: string, error?: string}>}
 */
export const login = async (usernameOrEmail, password) => {
    try {
        // Create Basic Auth header
        // Basic Auth format: "Basic base64(username:password)"
        const credentials = btoa(`${usernameOrEmail}:${password}`)

        // Make POST request to signin endpoint
        const response = await fetch(SIGNIN_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            // If response is not OK, get error message
            const errorText = await response.text()
            return {
                success: false,
                error: errorText || 'Invalid credentials. Please check your username/email and password.',
            }
        }

        // Extract JWT token from response
        // The token might be in different places depending on the API
        let token = null

        // First, try to get token from headers
        token = response.headers.get('Authorization')?.replace('Bearer ', '') ||
            response.headers.get('X-Token')

        // If not in headers, try to get from response body
        if (!token) {
            const contentType = response.headers.get('content-type')

            if (contentType && contentType.includes('application/json')) {
                // Response is JSON
                const data = await response.json()
                token = data.token || data.access_token || data.jwt || (typeof data === 'string' ? data : null)
            } else {
                // Response is plain text (JWT token directly)
                token = await response.text()
                token = token.trim()
            }
        }

        if (!token || token.length === 0) {
            return {
                success: false,
                error: 'No token received from server',
            }
        }

        // Save token to localStorage
        saveToken(token)

        return {
            success: true,
            token: token,
        }
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Network error. Please check your connection.',
        }
    }
}

/**
 * Logout function - removes JWT token
 */
export const logout = () => {
    removeToken()
}

