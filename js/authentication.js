// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

const DOMAIN = 'platform.zone01.gr'
const SIGNIN_URL = `https://${DOMAIN}/api/auth/signin`
const GRAPHQL_URL = `https://${DOMAIN}/api/graphql-engine/v1/graphql`

const auth = {
    async login(usernameOrEmail, password) {
        try {
            const credentials = btoa(`${usernameOrEmail}:${password}`)
            const response = await fetch(SIGNIN_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorText = await response.text()
                return {
                    success: false,
                    error: errorText || 'Invalid credentials. Please check your username/email and password.',
                }
            }

            let token = null
            token = response.headers.get('Authorization')?.replace('Bearer ', '') ||
                response.headers.get('X-Token')

            if (!token) {
                const contentType = response.headers.get('content-type')
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json()
                    token = data.token || data.access_token || data.jwt || (typeof data === 'string' ? data : null)
                } else {
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

            storage.saveToken(token)
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
    },

    logout() {
        storage.removeToken()
    }
}