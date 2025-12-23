import React from 'react'
import './Statistics.css'

function Statistics({ projects, piscine, technologies }) {
    return (
        <div className="statistics-container">
            <h2 className="statistics-title">Statistics</h2>

            <div className="charts-grid">
                {/* XP by Project Chart */}
                {projects && projects.length > 0 && (
                    <div className="chart-card">
                        <h3>XP Earned by Project</h3>
                        <XPByProjectChart data={projects} />
                    </div>
                )}

                {/* Piscine Stats */}
                {piscine && (
                    <div className="piscine-stats">
                        {/* Pass/Fail Ratio */}
                        <div className="chart-card">
                            <h3>Piscine Pass/Fail Ratio</h3>
                            <PassFailDonutChart data={piscine.passFail} />
                        </div>

                        {/* Exercise Attempts */}
                        {piscine.exercises && piscine.exercises.length > 0 && (
                            <div className="chart-card">
                                <h3>Exercise Attempts</h3>
                                <ExerciseAttemptsChart data={piscine.exercises} />
                            </div>
                        )}
                    </div>
                )}

                {/* Technologies Chart */}
                {technologies && technologies.length > 0 && (
                    <div className="chart-card">
                        <h3>Technologies</h3>
                        <TechnologiesChart data={technologies} />
                    </div>
                )}
            </div>
        </div>
    )
}

// XP by Project - Horizontal Bar Chart
function XPByProjectChart({ data }) {
    const maxXP = Math.max(...data.map(p => p.xp), 1)
    const chartWidth = 600
    const chartHeight = data.length * 50
    const barHeight = 30
    const spacing = 15

    return (
        <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="chart-svg"
        >
            {data.map((project, index) => {
                const barWidth = (project.xp / maxXP) * (chartWidth - 200)
                const y = index * (barHeight + spacing)

                return (
                    <g key={project.id} className="bar-group">
                        <text
                            x="0"
                            y={y + barHeight / 2}
                            dy="0.35em"
                            className="bar-label"
                            textAnchor="start"
                        >
                            {project.name.length > 25
                                ? project.name.substring(0, 25) + '...'
                                : project.name}
                        </text>
                        <rect
                            x="150"
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            className="bar-fill"
                            fill={`hsl(${220 + index * 10}, 70%, 60%)`}
                        >
                            <animate
                                attributeName="width"
                                from="0"
                                to={barWidth}
                                dur="1s"
                                fill="freeze"
                            />
                        </rect>
                        <text
                            x={barWidth + 160}
                            y={y + barHeight / 2}
                            dy="0.35em"
                            className="bar-value"
                        >
                            {project.xp.toLocaleString()} XP
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

// Pass/Fail Donut Chart
function PassFailDonutChart({ data }) {
    const { passed, failed, total, passPercentage } = data
    const size = 200
    const center = size / 2
    const radius = 70
    const strokeWidth = 30

    const passAngle = (passed / total) * 360
    const failAngle = (failed / total) * 360

    // Calculate arc paths
    const passPath = describeArc(center, center, radius, 0, passAngle)
    const failPath = describeArc(center, center, radius, passAngle, passAngle + failAngle)

    return (
        <div className="donut-chart-container">
            <svg viewBox={`0 0 ${size} ${size}`} className="chart-svg donut-svg">
                {/* Pass segment */}
                <path
                    d={passPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="donut-segment"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        from="0 439.8"
                        to={`${(passed / total) * 439.8} ${439.8}`}
                        dur="1.5s"
                        fill="freeze"
                    />
                </path>

                {/* Fail segment */}
                <path
                    d={failPath}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="donut-segment"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        from="0 439.8"
                        to={`${(failed / total) * 439.8} ${439.8}`}
                        dur="1.5s"
                        fill="freeze"
                    />
                </path>

                {/* Center text */}
                <text
                    x={center}
                    y={center - 10}
                    textAnchor="middle"
                    className="donut-center-large"
                >
                    {passPercentage}%
                </text>
                <text
                    x={center}
                    y={center + 15}
                    textAnchor="middle"
                    className="donut-center-small"
                >
                    Pass Rate
                </text>
            </svg>

            {/* Legend */}
            <div className="donut-legend">
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#10b981' }}></span>
                    <span>Passed: {passed}</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#ef4444' }}></span>
                    <span>Failed: {failed}</span>
                </div>
                <div className="legend-item">
                    <span>Total: {total}</span>
                </div>
            </div>
        </div>
    )
}

// Helper function for arc paths
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ")
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    }
}

// Exercise Attempts - Vertical Bar Chart
function ExerciseAttemptsChart({ data }) {
    const maxAttempts = Math.max(...data.map(e => e.attempts), 1)
    const chartWidth = 600
    const chartHeight = 400
    const barWidth = 30
    const spacing = 10
    const availableWidth = chartWidth - 100
    const barsPerRow = Math.floor(availableWidth / (barWidth + spacing))
    const rows = Math.ceil(data.length / barsPerRow)
    const rowHeight = 80

    return (
        <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="chart-svg"
        >
            {data.map((exercise, index) => {
                const row = Math.floor(index / barsPerRow)
                const col = index % barsPerRow
                const x = 50 + col * (barWidth + spacing)
                const y = row * rowHeight
                const barHeight = (exercise.attempts / maxAttempts) * 60
                const barY = y + 60 - barHeight

                return (
                    <g key={exercise.id} className="bar-group">
                        <rect
                            x={x}
                            y={barY}
                            width={barWidth}
                            height={barHeight}
                            className="bar-fill"
                            fill={exercise.passed ? '#10b981' : '#ef4444'}
                        >
                            <animate
                                attributeName="height"
                                from="0"
                                to={barHeight}
                                dur="0.8s"
                                fill="freeze"
                            />
                            <animate
                                attributeName="y"
                                from={y + 60}
                                to={barY}
                                dur="0.8s"
                                fill="freeze"
                            />
                        </rect>
                        <text
                            x={x + barWidth / 2}
                            y={y + 75}
                            textAnchor="middle"
                            className="bar-label-small"
                        >
                            {exercise.attempts}
                        </text>
                        <text
                            x={x + barWidth / 2}
                            y={y + 90}
                            textAnchor="middle"
                            className="bar-label-tiny"
                        >
                            {exercise.name.length > 8
                                ? exercise.name.substring(0, 8) + '...'
                                : exercise.name}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

// Technologies - Horizontal Bar Chart
function TechnologiesChart({ data }) {
    const maxXP = Math.max(...data.map(t => t.xp), 1)
    const chartWidth = 600
    const chartHeight = data.length * 45
    const barHeight = 35
    const spacing = 10

    return (
        <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="chart-svg"
        >
            {data.map((tech, index) => {
                const barWidth = (tech.xp / maxXP) * (chartWidth - 180)
                const y = index * (barHeight + spacing)

                return (
                    <g key={tech.name} className="bar-group">
                        <text
                            x="0"
                            y={y + barHeight / 2}
                            dy="0.35em"
                            className="bar-label"
                            textAnchor="start"
                        >
                            {tech.name}
                        </text>
                        <rect
                            x="120"
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            className="bar-fill"
                            fill={`hsl(${index * 30}, 70%, 55%)`}
                        >
                            <animate
                                attributeName="width"
                                from="0"
                                to={barWidth}
                                dur="1s"
                                fill="freeze"
                            />
                        </rect>
                        <text
                            x={barWidth + 130}
                            y={y + barHeight / 2}
                            dy="0.35em"
                            className="bar-value"
                        >
                            {tech.xp.toLocaleString()} XP
                        </text>
                        <text
                            x={barWidth + 250}
                            y={y + barHeight / 2}
                            dy="0.35em"
                            className="bar-value-small"
                        >
                            ({tech.projects} projects)
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

export default Statistics