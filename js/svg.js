// ============================================================================
// UI MANAGEMENT
// ============================================================================

const ui = {
    showLogin() {
        document.getElementById('login-page').style.display = 'flex'
        document.getElementById('profile-page').style.display = 'none'
    },

    showProfile() {
        document.getElementById('login-page').style.display = 'none'
        document.getElementById('profile-page').style.display = 'block'
    },

    showLoading() {
        document.getElementById('loading-state').style.display = 'block'
        document.getElementById('error-state').style.display = 'none'
        document.getElementById('profile-content').style.display = 'none'
    },

    showError(message, isExpired = false) {
        document.getElementById('loading-state').style.display = 'none'
        document.getElementById('error-state').style.display = 'block'
        document.getElementById('profile-content').style.display = 'none'
        document.getElementById('error-message').textContent = message
        const retryButton = document.getElementById('retry-button')
        retryButton.textContent = isExpired ? 'Go to Login' : 'Retry'
        retryButton.onclick = isExpired ? () => app.logout() : () => window.location.reload()
    },

    showContent() {
        document.getElementById('loading-state').style.display = 'none'
        document.getElementById('error-state').style.display = 'none'
        document.getElementById('profile-content').style.display = 'grid'
    },

    updateProfile(data) {
        const { user, xp, skills, audit, projects, latestProjects } = data

        // User info
        document.getElementById('user-name').textContent = user?.name || 'N/A'
        document.getElementById('user-login').textContent = user?.login || 'N/A'
        if (user?.email) {
            document.getElementById('user-email').textContent = user.email
            document.getElementById('user-email-item').style.display = 'flex'
        }

        // XP
        document.getElementById('xp-total').textContent = xp?.total?.toLocaleString() || '0'

        // XP Projects SVG - Pie Chart (all projects)
        const xpProjectsContainer = document.getElementById('xp-projects-svg-container')
        if (xpProjectsContainer && projects && projects.length > 0) {
            xpProjectsContainer.innerHTML = ''
            try {
                // Use all projects for pie chart
                const xpChart = this.createXPByProjectPieChart(projects)
                if (xpChart) {
                    xpProjectsContainer.appendChild(xpChart)
                }
            } catch (error) {
                console.error('Error creating XP projects pie chart:', error)
            }
        }

        // Latest Projects SVG - Bar Chart (top 5 latest)
        const latestProjectsContainer = document.getElementById('xp-latest-projects-svg-container')
        if (latestProjectsContainer && latestProjects && latestProjects.length > 0) {
            latestProjectsContainer.innerHTML = ''
            try {
                const latestChart = this.createLatestProjectsChart(latestProjects, true)
                if (latestChart) {
                    latestProjectsContainer.appendChild(latestChart)
                }
            } catch (error) {
                console.error('Error creating latest projects chart:', error)
            }
        }

        // Audit
        document.getElementById('audit-ratio').textContent = audit?.ratio || '0.00'
        document.getElementById('audit-up').textContent = audit?.up || '0'
        document.getElementById('audit-down').textContent = audit?.down || '0'

        // Audit Ratio SVG
        const auditSvgContainer = document.getElementById('audit-ratio-svg-container')
        if (auditSvgContainer && audit) {
            auditSvgContainer.innerHTML = ''
            try {
                const gauge = this.createAuditRatioGauge(audit)
                if (gauge) {
                    auditSvgContainer.appendChild(gauge)
                }
            } catch (error) {
                console.error('Error creating audit ratio gauge:', error)
            }
        }

        // Skills
        const skillsList = document.getElementById('skills-list')
        const skillsError = document.getElementById('skills-error')
        skillsList.innerHTML = ''

        if (skills?.skills && skills.skills.length > 0) {
            skillsError.style.display = 'none'
            skills.skills.forEach(skill => {
                const skillItem = document.createElement('div')
                skillItem.className = 'skill-item'
                skillItem.innerHTML = `
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-amount">${skill.amount} %</span>
                `
                skillsList.appendChild(skillItem)
            })
        } else {
            skillsError.textContent = skills?.error || 'No skills data available'
            skillsError.style.display = 'block'
        }

    },

    renderStatistics(projectss) {
        const chartsGrid = document.getElementById('charts-grid')
        if (chartsGrid) {
            chartsGrid.innerHTML = ''
        }
    },

    // Create Latest Projects Chart (bar chart, similar to XP by Project)
    createLatestProjectsChart(data, compact = false) {
        const maxXP = Math.max(...data.map(p => p.xp), 1)
        const chartWidth = compact ? 400 : 600
        const barHeight = compact ? 20 : 30
        const spacing = compact ? 10 : 15
        const labelWidth = compact ? 120 : 150
        const chartHeight = data.length * (barHeight + spacing)

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
        svg.className = compact ? 'chart-svg compact-chart' : 'chart-svg'

        data.forEach((project, index) => {
            const barWidth = (project.xp / maxXP) * (chartWidth - labelWidth - 80)
            const y = index * (barHeight + spacing)

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            g.className = 'bar-group'

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            text.setAttribute('x', '0')
            text.setAttribute('y', y + barHeight / 2)
            text.setAttribute('dy', '0.35em')
            text.className = compact ? 'bar-label-small' : 'bar-label'
            const maxNameLength = compact ? 15 : 25
            text.textContent = project.name.length > maxNameLength
                ? project.name.substring(0, maxNameLength) + '...'
                : project.name

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
            rect.setAttribute('x', labelWidth)
            rect.setAttribute('y', y)
            rect.setAttribute('width', barWidth)
            rect.setAttribute('height', barHeight)
            rect.className = 'bar-fill'
            rect.setAttribute('fill', `hsl(${220 + index * 10}, 70%, 60%)`)

            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
            animate.setAttribute('attributeName', 'width')
            animate.setAttribute('from', '0')
            animate.setAttribute('to', barWidth)
            animate.setAttribute('dur', '1s')
            animate.setAttribute('fill', 'freeze')
            rect.appendChild(animate)

            const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            valueText.setAttribute('x', barWidth + labelWidth + 10)
            valueText.setAttribute('y', y + barHeight / 2)
            valueText.setAttribute('dy', '0.35em')
            valueText.className = compact ? 'bar-value-small' : 'bar-value'
            valueText.textContent = compact ? `${project.xp.toLocaleString()}` : `${project.xp.toLocaleString()} XP`

            g.appendChild(text)
            g.appendChild(rect)
            g.appendChild(valueText)
            svg.appendChild(g)
        })

        return svg
    },

    // Create XP by Project Pie Chart (all projects)
    createXPByProjectPieChart(data) {
        if (!data || data.length === 0) {
            return document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        }

        const size = 300
        const center = size / 2
        const radius = 100
        const innerRadius = 0 // For donut effect (set to 0 for full pie)

        // Calculate total XP
        const totalXP = data.reduce((sum, project) => sum + project.xp, 0)
        if (totalXP === 0) {
            return document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        }

        const container = document.createElement('div')
        container.className = 'pie-chart-container'

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
        svg.className = 'chart-svg pie-chart-svg'

        let currentAngle = -90 // Start at top

        data.forEach((project, index) => {
            const percentage = (project.xp / totalXP) * 100
            const angle = (project.xp / totalXP) * 360

            // Create donut segment path
            const startAngle = currentAngle
            const endAngle = currentAngle + angle

            // Calculate points for outer and inner arcs
            const outerStart = this.polarToCartesian(center, center, radius, startAngle)
            const outerEnd = this.polarToCartesian(center, center, radius, endAngle)
            const innerStart = this.polarToCartesian(center, center, innerRadius, endAngle)
            const innerEnd = this.polarToCartesian(center, center, innerRadius, startAngle)

            const largeArcFlag = angle > 180 ? "1" : "0"

            // Create donut segment path: outer arc -> line to inner -> inner arc (reverse) -> close
            const fullPath = [
                "M", outerStart.x, outerStart.y,
                "A", radius, radius, 0, largeArcFlag, 1, outerEnd.x, outerEnd.y,
                "L", innerStart.x, innerStart.y,
                "A", innerRadius, innerRadius, 0, largeArcFlag, 0, innerEnd.x, innerEnd.y,
                "Z"
            ].join(" ")

            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            pathEl.setAttribute('d', fullPath)
            pathEl.setAttribute('fill', `hsl(${index * 360 / data.length}, 70%, 60%)`)
            pathEl.className = 'pie-segment'
            pathEl.setAttribute('data-name', project.name)
            pathEl.setAttribute('data-xp', project.xp)
            pathEl.setAttribute('data-percentage', percentage.toFixed(1))

            // Add hover effect
            pathEl.style.cursor = 'pointer'
            pathEl.style.transition = 'opacity 0.2s'
            pathEl.addEventListener('mouseenter', function () {
                this.style.opacity = '0.8'
            })
            pathEl.addEventListener('mouseleave', function () {
                this.style.opacity = '1'
            })

            // Animate the path
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
            animate.setAttribute('attributeName', 'd')
            animate.setAttribute('from', `M ${center} ${center} L ${center} ${center} Z`)
            animate.setAttribute('to', fullPath)
            animate.setAttribute('dur', '1s')
            animate.setAttribute('fill', 'freeze')
            pathEl.appendChild(animate)

            svg.appendChild(pathEl)

            currentAngle += angle
        })


        // Create legend
        const legend = document.createElement('div')
        legend.className = 'pie-legend'

  

        container.appendChild(svg)
        container.appendChild(legend)
        return container
    },

    // Helper function for arc paths
    describeArc(x, y, radius, startAngle, endAngle) {
        const start = this.polarToCartesian(x, y, radius, endAngle)
        const end = this.polarToCartesian(x, y, radius, startAngle)
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ")
    },

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        }
    },

    // Create Audit Ratio Gauge Chart
    createAuditRatioGauge(auditData) {
        const { up, down, ratio } = auditData
        const size = 200
        const center = size / 2
        const radius = 70
        const strokeWidth = 20

        // Calculate the ratio value (handle infinity and edge cases)
        let ratioValue = 0
        let originalRatio = 0
        if (ratio === '∞' || ratio === 'Infinity') {
            ratioValue = 1 // Show as full gauge for infinity
            originalRatio = 999 // For color calculation
        } else {
            originalRatio = parseFloat(ratio) || 0
            // Normalize ratio: 0.0 = 0%, 1.0 = 50%, 2.0 = 100% of gauge
            // So we divide by 2 to get the fill percentage
            ratioValue = Math.min(originalRatio, 2.0) / 2.0
        }

        const container = document.createElement('div')
        container.className = 'audit-gauge-container'

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
        svg.setAttribute('width', '180')
        svg.setAttribute('height', '180')
        svg.className = 'chart-svg audit-gauge-svg'

        // Background arc (full gauge) - always visible
        const bgPath = this.describeArc(center, center, radius, -90, 90)
        const bgPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        bgPathEl.setAttribute('d', bgPath)
        bgPathEl.setAttribute('fill', 'none')
        bgPathEl.setAttribute('stroke', '#e0e0e0')
        bgPathEl.setAttribute('stroke-width', strokeWidth)
        bgPathEl.setAttribute('stroke-linecap', 'round')
        svg.appendChild(bgPathEl)

        // Filled arc (actual ratio)
        if (ratioValue > 0) {
            const fillAngle = -90 + (ratioValue * 180)
            const fillPath = this.describeArc(center, center, radius, -90, fillAngle)
            const fillPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            fillPathEl.setAttribute('d', fillPath)
            fillPathEl.setAttribute('fill', 'none')

            // Color based on ratio: green for good (>1.0), yellow for ok (0.5-1.0), red for low (<0.5)
            let strokeColor = '#ef4444' // red
            if (originalRatio > 1.0) {
                strokeColor = '#10b981' // green
            } else if (originalRatio > 0.5) {
                strokeColor = '#f59e0b' // yellow
            }

            fillPathEl.setAttribute('stroke', strokeColor)
            fillPathEl.setAttribute('stroke-width', strokeWidth)
            fillPathEl.setAttribute('stroke-linecap', 'round')
            fillPathEl.className = 'audit-gauge-fill'

            // Calculate path length for animation (half circle = π * radius)
            const pathLength = Math.PI * radius

            // Set initial stroke-dasharray and animate
            fillPathEl.setAttribute('stroke-dasharray', pathLength)
            fillPathEl.setAttribute('stroke-dashoffset', pathLength)

            // Animate using stroke-dashoffset
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
            animate.setAttribute('attributeName', 'stroke-dashoffset')
            animate.setAttribute('from', pathLength)
            animate.setAttribute('to', pathLength * (1 - ratioValue))
            animate.setAttribute('dur', '1.5s')
            animate.setAttribute('fill', 'freeze')
            fillPathEl.appendChild(animate)

            svg.appendChild(fillPathEl)
        }

        // Center text showing ratio
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        centerText.setAttribute('x', center)
        centerText.setAttribute('y', center + 5)
        centerText.setAttribute('text-anchor', 'middle')
        centerText.className = 'audit-gauge-text'
        centerText.textContent = ratio

        svg.appendChild(centerText)

        container.appendChild(svg)
        return container
    }
}