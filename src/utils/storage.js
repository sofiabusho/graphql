// Utility functions to save and retrieve the JWT token from browser's localStorage
// localStorage persists data even after closing the browser

const TOKEN_KEY = 'graphql_jwt_token'

/**
 * Save the JWT token to localStorage
 * @param {string} token - The JWT token to save
 */
export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token) // localStorage because memory is lost when the browser is closed
}

/**
 * Get the JWT token from localStorage
 * @returns {string|null} - The JWT token or null if not found
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

export const decodeJWT = (token) => {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const payload = JSON.parse(atob(parts[1]))
        return payload
    } catch (error) {
        console.error('Failed to decode JWT:', error)
        return null
    }
}

export const getUserIdFromToken = () => {
    const token = getToken()
    if (!token) return null

    const payload = decodeJWT(token)
    return payload?.userId || payload?.id || null
}

/**
 * Remove the JWT token from localStorage (for logout)
 */
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
}

/**
 * Check if user is authenticated (has a token)
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
    return getToken() !== null
}


/**
 * Check if JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
    if (!token) return true

    try {
        const payload = decodeJWT(token)
        if (!payload || !payload.exp) return false // If no exp, assume valid

        const expirationTime = payload.exp * 1000 // Convert to milliseconds
        const currentTime = Date.now()

        return currentTime >= expirationTime
    } catch (error) {
        console.error('Failed to check token expiration:', error)
        return true // Assume expired if we can't decode
    }
}

/**
 * Check if current token is expired
 * @returns {boolean} - True if token is expired or doesn't exist
 */
export const isCurrentTokenExpired = () => {
    const token = getToken()
    return isTokenExpired(token)
}
