// ============================================================================
// GRAPHQL SERVICE
// ============================================================================

const graphql = {
    async request(query, token) {
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
    },

    async getUserInfo(token) {
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

        const result = await this.request(query, token)
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
    },

    async getXPByProject(token) {
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

        const result = await this.request(query, token)
        const transactions = result.data?.transaction || []

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

        const projects = Array.from(projectMap.values())
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10)

        return projects
    },

    async getTotalXP(token) {
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

        const result = await this.request(query, token)
        const totalXP = result.data?.transaction_aggregate?.aggregate?.sum?.amount || 0

        return {
            total: totalXP,
            transactions: [],
        }
    },

    async getSkills(token) {
        try {
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

            let result
            try {
                result = await this.request(query, token)
            } catch (error1) {
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
                result = await this.request(query, token)
            }

            const transactions = result.data?.transaction || []

            const skills = transactions
                .map((transaction, index) => ({
                    id: transaction.id || index,
                    name: transaction.type?.replace('skill_', '').replace(/-/g, ' ') || `Skill ${index + 1}`,
                    amount: transaction.amount || 0,
                }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)

            return {
                skills: skills,
            }
        } catch (error) {
            console.warn('Failed to fetch skills from transactions:', error.message)
            return {
                skills: [],
                error: 'Could not fetch skills from available data',
            }
        }
    },

    async getAuditRatio(token) {
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

        const result = await this.request(query, token)

        const auditDown = result.data?.audit_down?.aggregate?.sum?.amount || 0
        const auditUp = result.data?.audit_up?.aggregate?.sum?.amount || 0

        const ratio = auditDown > 0 ? (auditUp / auditDown).toFixed(2) : auditUp > 0 ? '∞' : '0.00'

        return {
            up: auditUp,
            down: auditDown,
            ratio: ratio,
        }
    },

    async getPiscineStats(token) {
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

        const result = await this.request(query, token)
        const progress = result.data?.progress || []

        const passed = progress.filter(p => p.grade === 1 || p.grade > 0).length
        const failed = progress.filter(p => p.grade === 0).length
        const total = progress.length

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
            .slice(0, 15)

        return {
            passFail: {
                passed,
                failed,
                total,
                passPercentage: total > 0 ? ((passed / total) * 100).toFixed(1) : 0,
            },
            exercises,
        }
    },

    async getTechnologies(token) {
        // Query projects with their progress to determine completion status per technology
        const query = `
            {
                progress(
                    where: {
                        object: { type: { _eq: "project" } }
                    }
                ) {
                    id
                    grade
                    objectId
                    object {
                        id
                        name
                        type
                        attrs
                    }
                    path
                }
                transaction(
                    where: { 
                        type: { _eq: "xp" }
                        object: { type: { _eq: "project" } }
                    }
                ) {
                    id
                    objectId
                    path
                    object {
                        id
                        name
                        type
                        attrs
                    }
                }
            }
        `

        const result = await this.request(query, token)
        const progress = result.data?.progress || []
        const transactions = result.data?.transaction || []

        // Map to track completed projects per technology
        const techProjectsMap = new Map()
        // Map to track all projects per technology
        const techAllProjectsMap = new Map()

        // Process progress to find completed projects (grade > 0 means completed)
        progress.forEach(item => {
            if (item.object && item.object.type === 'project') {
                const projectName = (item.object.name || '').toLowerCase()
                const path = (item.path || '').toLowerCase()

                // Extract technology from project name or path
                const tech = this.extractTechnology(projectName, path)
                if (tech) {
                    if (!techProjectsMap.has(tech)) {
                        techProjectsMap.set(tech, new Set())
                    }
                    if (!techAllProjectsMap.has(tech)) {
                        techAllProjectsMap.set(tech, new Set())
                    }

                    // Add to all projects
                    techAllProjectsMap.get(tech).add(item.objectId)

                    // Add to completed if grade > 0
                    if (item.grade > 0) {
                        techProjectsMap.get(tech).add(item.objectId)
                    }
                }
            }
        })

        // Also check transactions to find more projects
        transactions.forEach(transaction => {
            if (transaction.object && transaction.object.type === 'project') {
                const projectName = (transaction.object.name || '').toLowerCase()
                const path = (transaction.path || '').toLowerCase()

                const tech = this.extractTechnology(projectName, path)
                if (tech) {
                    if (!techProjectsMap.has(tech)) {
                        techProjectsMap.set(tech, new Set())
                    }
                    if (!techAllProjectsMap.has(tech)) {
                        techAllProjectsMap.set(tech, new Set())
                    }

                    techAllProjectsMap.get(tech).add(transaction.objectId)
                }
            }
        })

        // Convert to array format
        const technologies = []
        techAllProjectsMap.forEach((projects, tech) => {
            const completed = techProjectsMap.get(tech) || new Set()
            technologies.push({
                name: tech,
                completed: completed.size,
                total: projects.size
            })
        })

        // Sort by completed projects (descending) and take top 5
        return technologies
            .sort((a, b) => b.completed - a.completed)
            .slice(0, 5)
    },

    // Helper function to extract technology name from project name or path
    extractTechnology(projectName, path) {
        const combined = `${projectName} ${path}`.toLowerCase()

        // Technology keywords mapping
        const techMap = {
            'go': ['go', 'golang'],
            'js': ['js', 'javascript', 'node'],
            'html': ['html'],
            'css': ['css'],
            'python': ['python'],
            'django': ['django'],
            'sql': ['sql'],
            'c': ['c', 'c-language'],
            'cpp': ['cpp', 'c++'],
            'docker': ['docker'],
            'unix': ['unix', 'shell', 'bash'],
            'git': ['git'],
        }

        for (const [tech, keywords] of Object.entries(techMap)) {
            if (keywords.some(keyword => combined.includes(keyword))) {
                return tech.toUpperCase()
            }
        }

        return null
    },

    async getAllUserData(token) {
        try {
            const [userInfo, projectsData, xpData, auditData, piscineData, techData] = await Promise.all([
                this.getUserInfo(token),
                this.getXPByProject(token).catch(err => {
                    console.warn('Could not fetch projects:', err.message)
                    return []
                }),
                this.getTotalXP(token),
                this.getAuditRatio(token).catch(err => {
                    console.warn('Could not fetch audit ratio:', err.message)
                    return { up: 0, down: 0, ratio: '0.00' }
                }),
                this.getPiscineStats(token).catch(err => {
                    console.warn('Could not fetch piscine stats:', err.message)
                    return { passFail: { passed: 0, failed: 0, total: 0, passPercentage: 0 }, exercises: [] }
                }),
                this.getTechnologies(token).catch(err => {
                    console.warn('Could not fetch technologies:', err.message)
                    return []
                }),
            ])

            let skillsData = { skills: [], error: 'Not available' }
            try {
                skillsData = await this.getSkills(token)
            } catch (error) {
                console.warn('Could not fetch skills:', error.message)
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
}
