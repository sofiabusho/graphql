// GraphQL service - handles all GraphQL queries to fetch user data
// This communicates with the GraphQL API endpoint

import { getToken } from '../utils/storage.js'

const DOMAIN = 'platform.zone01.gr'

// Use proxy in development, direct URL in production (same as auth.js)
const isDevelopment = import.meta.env.DEV
const GRAPHQL_URL = isDevelopment
    ? '/api/graphql-engine/v1/graphql'  // Uses Vite proxy
    : `https://${DOMAIN}/api/graphql-engine/v1/graphql`  // Direct URL in production

/**
 * Helper function to make GraphQL requests
 * @param {string} query - GraphQL query string
 * @param {string} token - JWT token for authentication
 * @returns {Promise<{data: any, errors: any[]}>}
 */
const graphqlRequest = async (query, token) => {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        // GraphQL returns errors in the response, not as HTTP errors
        if (result.errors) {
            console.error('GraphQL errors:', result.errors)
            throw new Error(result.errors[0]?.message || 'GraphQL query failed')
        }

        return {
            data: result.data,
            errors: result.errors || [],
        }
    } catch (error) {
        console.error('GraphQL request failed:', error)
        throw error
    }
}

/**
 * Get basic user information (id, login, email if available)
 * @param {string} token - JWT token
 * @returns {Promise<{id: number, login: string, email?: string}>}
 */
export const getUserInfo = async (token) => {
    const query = `
        {
            user {
                login
                email
                firstName
                lastName
            }
        }
    `

    const result = await graphqlRequest(query, token)

    // GraphQL returns user as an array, get the first (authenticated) user
    const user = result.data?.user?.[0] || null

    if (!user) {
        throw new Error('User information not found')
    }

    const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`.trim()
    : user.firstName || user.lastName || null

    return {
        login: user.login,
        email: user.email || null,
        name: fullName,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
    }
}

/**
 * Get XP earned by project
 * @param {string} token - JWT token
 * @returns {Promise<Array>} - Array of projects with XP
 */
export const getXPByProject = async (token) => {
    const query = `
        {
            transaction(
                where: { 
                    type: { _eq: "xp" }
                    object: { type: { _eq: "project" } }
                }
                order_by: { createdAt: desc }
            ) {
                id
                amount
                objectId
                object {
                    id
                    name
                    type
                }
            }
        }
    `

    const result = await graphqlRequest(query, token)
    const transactions = result.data?.transaction || []

    // Group by project and sum XP
    const projectMap = new Map()
    transactions.forEach(transaction => {
        const projectId = transaction.objectId
        const projectName = transaction.object?.name || `Project ${projectId}`

        if (!projectMap.has(projectId)) {
            projectMap.set(projectId, {
                id: projectId,
                name: projectName,
                xp: 0,
            })
        }

        const project = projectMap.get(projectId)
        project.xp += transaction.amount || 0
    })

    // Convert to array and sort by XP descending
    const projects = Array.from(projectMap.values())
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 10) // Top 10 projects

    return projects
}

/**
 * Get total XP amount from XP transactions for div-01 only
 * @param {string} token - JWT token
 * @returns {Promise<number>} - Total XP amount
 */
export const getTotalXP = async (token) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:90', message: 'getTotalXP called - div-01 filter', data: { hasToken: !!token }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'XP1' }) }).catch(() => { });
    // #endregion

    const query = `
        {
            transaction_aggregate(
                where: { 
                    type: { _eq: "xp" }
                    event: { path: { _ilike: "%/div-01" } }
                }
            ) {
                aggregate {
                    sum {
                        amount
                    }
                }
            }
        }
    `

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:108', message: 'XP query constructed', data: { query }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'XP2' }) }).catch(() => { });
    // #endregion

    const result = await graphqlRequest(query, token)

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:114', message: 'XP response received', data: { hasData: !!result.data, aggregateSum: result.data?.transaction_aggregate?.aggregate?.sum?.amount || 0 }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'XP3' }) }).catch(() => { });
    // #endregion

    const totalXP = result.data?.transaction_aggregate?.aggregate?.sum?.amount || 0

    return {
        total: totalXP,
        transactions: [], // Not needed for div-01 filtered view
    }
}


/**
 * Get skills directly from transactions
 * Skills are transactions with type matching "skill%" pattern and eventId = 200
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Skills data
 */
export const getSkills = async (token) => {
    try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:188', message: 'getSkills called', data: { hasToken: !!token }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion

        // Query skills directly from transactions using the pattern from the working query
        // Based on: skills: transactions(where: {eventId: {_eq: 200}, _and: {type: {like: "skill%"}}}, distinct_on: [type], order_by: {type: asc, amount: desc})
        // Try multiple query variations to handle different GraphQL syntax possibilities
        let query = `
            {
                transaction(
                    where: { 
                        eventId: { _eq: 200 }
                        _and: [{ type: { _like: "skill%" } }]
                    }
                    distinct_on: [type]
                    order_by: { type: asc, amount: desc }
                ) {
                    id
                    type
                    amount
                }
            }
        `

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:210', message: 'Skills query constructed - attempt 1', data: { query }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
        // #endregion

        let result
        try {
            result = await graphqlRequest(query, token)
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:217', message: 'Query attempt 1 success', data: { hasData: !!result.data, hasErrors: !!result.errors }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B1' }) }).catch(() => { });
            // #endregion
        } catch (error1) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:221', message: 'Query attempt 1 failed, trying alternative', data: { error: error1.message }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B2' }) }).catch(() => { });
            // #endregion

            // Try alternative query without _and array syntax
            query = `
                {
                    transaction(
                        where: { 
                            eventId: { _eq: 200 }
                            type: { _ilike: "skill%" }
                        }
                        distinct_on: [type]
                        order_by: { type: asc, amount: desc }
                    ) {
                        id
                        type
                        amount
                    }
                }
            `
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:238', message: 'Skills query constructed - attempt 2', data: { query }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B3' }) }).catch(() => { });
            // #endregion

            result = await graphqlRequest(query, token)
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:241', message: 'Query attempt 2 result', data: { hasData: !!result.data, hasErrors: !!result.errors }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B4' }) }).catch(() => { });
            // #endregion
        }

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:214', message: 'GraphQL response received', data: { hasData: !!result.data, hasErrors: !!result.errors, transactionCount: result.data?.transaction?.length || 0, rawResponse: JSON.stringify(result) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
        // #endregion

        const transactions = result.data?.transaction || []

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:260', message: 'Processing transactions', data: { transactionCount: transactions.length, firstTransaction: transactions[0] || null }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
        // #endregion

        // Map transactions to skills format, sort by amount descending, and take top 5
        const skills = transactions
            .map((transaction, index) => ({
                id: transaction.id || index,
                name: transaction.type?.replace('skill_', '').replace(/-/g, ' ') || `Skill ${index + 1}`,
                amount: transaction.amount || 0,
            }))
            .sort((a, b) => b.amount - a.amount) // Sort by amount descending
            .slice(0, 5) // Take only top 5 skills

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:272', message: 'Skills processed - top 5', data: { skillsCount: skills.length, skills }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' }) }).catch(() => { });
        // #endregion

        return {
            skills: skills,
        }
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:235', message: 'getSkills error', data: { errorMessage: error.message, errorStack: error.stack }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'F' }) }).catch(() => { });
        // #endregion

        console.warn('Failed to fetch skills from transactions:', error.message)
        return {
            skills: [],
            error: 'Could not fetch skills from available data',
        }
    }
}

/**
 * Get audit ratio (audit_up / audit_down) for div-01
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Audit ratio data
 */
export const getAuditRatio = async (token) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:310', message: 'getAuditRatio called', data: { hasToken: !!token }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'AR1' }) }).catch(() => { });
    // #endregion

    const query = `
        {
            audit_down: transaction_aggregate(
                where: { 
                    type: { _eq: "down" }
                    event: { path: { _ilike: "%/div-01" } }
                }
            ) {
                aggregate {
                    sum {
                        amount
                    }
                }
            }
            audit_up: transaction_aggregate(
                where: { 
                    type: { _eq: "up" }
                    event: { path: { _ilike: "%/div-01" } }
                }
            ) {
                aggregate {
                    sum {
                        amount
                    }
                }
            }
        }
    `

    fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:340', message: 'Audit ratio query constructed', data: { query }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'AR2' }) }).catch(() => { });
    // #endregion

    const result = await graphqlRequest(query, token)

    const auditDown = result.data?.audit_down?.aggregate?.sum?.amount || 0
    const auditUp = result.data?.audit_up?.aggregate?.sum?.amount || 0

    // Calculate ratio (avoid division by zero)
    const ratio = auditDown > 0 ? (auditUp / auditDown).toFixed(2) : auditUp > 0 ? '∞' : '0.00'

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8a96fcc-743f-4fd2-94f5-b5651ce5c425', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'graphql.js:355', message: 'Audit ratio calculated', data: { auditDown, auditUp, ratio }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'AR3' }) }).catch(() => { });
    // #endregion

    return {
        up: auditUp,
        down: auditDown,
        ratio: ratio,
    }
}

/**
 * Get Piscine statistics (JS/Go)
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Piscine stats with pass/fail ratio and exercise attempts
 */
export const getPiscineStats = async (token) => {
    const query = `
        {
            progress(
                where: {
                    _or: [
                        { path: { _ilike: "%piscine-js%" } }
                        { path: { _ilike: "%piscine-go%" } }
                    ]
                }
                order_by: { createdAt: desc }
            ) {
                id
                grade
                objectId
                path
                createdAt
                object {
                    id
                    name
                    type
                }
            }
        }
    `

    const result = await graphqlRequest(query, token)
    const progress = result.data?.progress || []

    // Calculate pass/fail ratio
    const passed = progress.filter(p => p.grade === 1 || p.grade > 0).length
    const failed = progress.filter(p => p.grade === 0).length
    const total = progress.length

    // Count attempts per exercise
    const exerciseMap = new Map()
    progress.forEach(item => {
        const exerciseId = item.objectId
        const exerciseName = item.object?.name || `Exercise ${exerciseId}`

        if (!exerciseMap.has(exerciseId)) {
            exerciseMap.set(exerciseId, {
                id: exerciseId,
                name: exerciseName,
                attempts: 0,
                passed: false,
            })
        }

        const exercise = exerciseMap.get(exerciseId)
        exercise.attempts += 1
        if (item.grade === 1 || item.grade > 0) {
            exercise.passed = true
        }
    })

    const exercises = Array.from(exerciseMap.values())
        .sort((a, b) => b.attempts - a.attempts)
        .slice(0, 15) // Top 15 exercises by attempts

    return {
        passFail: {
            passed,
            failed,
            total,
            passPercentage: total > 0 ? ((passed / total) * 100).toFixed(1) : 0,
        },
        exercises,
    }
}

/**
 * Get technologies from projects and piscines
 * @param {string} token - JWT token
 * @returns {Promise<Array>} - Array of technologies with usage data
 */
export const getTechnologies = async (token) => {
    const query = `
        {
            transaction(
                where: { 
                    type: { _eq: "xp" }
                    _or: [
                        { object: { type: { _eq: "project" } } }
                        { path: { _ilike: "%piscine%" } }
                    ]
                }
            ) {
                id
                amount
                path
                objectId
                object {
                    id
                    name
                    type
                    attrs
                }
            }
        }
    `

    const result = await graphqlRequest(query, token)
    const transactions = result.data?.transaction || []

    // Technology mapping from paths and project names
    const techMap = new Map()

    const techKeywords = {
        'javascript': ['js', 'javascript', 'node', 'react', 'vue', 'angular'],
        'go': ['go', 'golang'],
        'python': ['python', 'django', 'flask'],
        'c': ['c', 'c-language'],
        'cpp': ['cpp', 'c++', 'cplusplus'],
        'sql': ['sql', 'database', 'postgres', 'mysql'],
        'docker': ['docker', 'container'],
        'html': ['html'],
        'css': ['css'],
        'git': ['git'],
    }

    transactions.forEach(transaction => {
        const path = (transaction.path || '').toLowerCase()
        const projectName = (transaction.object?.name || '').toLowerCase()
        const combined = `${path} ${projectName}`

        // Check for technology matches
        Object.entries(techKeywords).forEach(([tech, keywords]) => {
            const matches = keywords.some(keyword =>
                combined.includes(keyword)
            )

            if (matches) {
                if (!techMap.has(tech)) {
                    techMap.set(tech, {
                        name: tech.charAt(0).toUpperCase() + tech.slice(1),
                        xp: 0,
                        projects: 0,
                    })
                }

                const techData = techMap.get(tech)
                techData.xp += transaction.amount || 0
                if (transaction.object?.type === 'project') {
                    techData.projects += 1
                }
            }
        })
    })

    // Convert to array and sort by XP
    const technologies = Array.from(techMap.values())
        .sort((a, b) => b.xp - a.xp)

    return technologies
}

/**
 * Get all user data in one call (convenience function)
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Combined user data
 */
export const getAllUserData = async (token) => {
    try {
        // Fetch all data in parallel for better performance
        const [userInfo, projectsData, xpData, auditData, piscineData, techData] = await Promise.all([
            getUserInfo(token),
            getXPByProject(token).catch(err => {
                console.warn('Could not fetch projects:', err.message)
                return []
            }),
            getTotalXP(token),
            getAuditRatio(token).catch(err => {
                console.warn('Could not fetch audit ratio:', err.message)
                return { up: 0, down: 0, ratio: '0.00' }
            }),
            getPiscineStats(token).catch(err => {
                console.warn('Could not fetch piscine stats:', err.message)
                return { passFail: { passed: 0, failed: 0, total: 0, passPercentage: 0 }, exercises: [] }
            }),
            getTechnologies(token).catch(err => {
                console.warn('Could not fetch technologies:', err.message)
                return []
            }),
        ])

        // Try to get skills, but don't fail if it doesn't work
        let skillsData = { skills: [], error: 'Not available' }
        try {
            skillsData = await getSkills(token)
        } catch (error) {
            console.warn('Could not fetch skills:', error.message)
            // skillsData already set to default empty value
        }

        return {
            user: userInfo,
            xp: xpData,
            skills: skillsData,
            audit: auditData,
            projects: projectsData,
            piscine: piscineData,
            technologies: techData,
        }
    } catch (error) {
        console.error('Failed to fetch all user data:', error)
        throw error
    }


}

