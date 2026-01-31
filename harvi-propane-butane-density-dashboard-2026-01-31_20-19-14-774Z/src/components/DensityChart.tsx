import React, { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import type { GasType } from '../types/propane'
import { generateChartData, GAS_PROPERTIES } from '../utils/propaneCalculations'

interface DensityChartProps {
  gasType: GasType
  currentTemperature: number
  currentDensity: number
  mixturePropanePercent: number
}

export function DensityChart({ gasType, currentTemperature, currentDensity, mixturePropanePercent }: DensityChartProps) {
  const chartData = useMemo(() => generateChartData(gasType, mixturePropanePercent, 21), [gasType, mixturePropanePercent])
  const gasProps = GAS_PROPERTIES[gasType]
  
  // Extract gradient colors for dynamic chart styling
  const chartColor = gasType === 'propane' ? 'rgb(59 130 246)' : gasType === 'butane' ? 'rgb(16 185 129)' : 'rgb(251 146 60)'

  // Calculate scales for SVG
  const minDensity = Math.min(...chartData.map(d => d.density))
  const maxDensity = Math.max(...chartData.map(d => d.density))
  const densityRange = maxDensity - minDensity
  const padding = densityRange * 0.1

  const width = 800
  const height = 300
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 60 }
  const chartWidth = width - chartPadding.left - chartPadding.right
  const chartHeight = height - chartPadding.top - chartPadding.bottom

  // Scale functions
  const scaleX = (temp: number) => {
    return chartPadding.left + ((temp - gasProps.minTemp) / (gasProps.maxTemp - gasProps.minTemp)) * chartWidth
  }

  const scaleY = (density: number) => {
    return height - chartPadding.bottom - ((density - (minDensity - padding)) / (maxDensity - minDensity + 2 * padding)) * chartHeight
  }

  // Generate path
  const pathD = chartData
    .map((d, i) => {
      const x = scaleX(d.temp)
      const y = scaleY(d.density)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  // Generate gradient fill path
  const fillPathD = `${pathD} L ${scaleX(gasProps.maxTemp)} ${height - chartPadding.bottom} L ${scaleX(gasProps.minTemp)} ${height - chartPadding.bottom} Z`

  // Current point position
  const currentX = scaleX(currentTemperature)
  const currentY = scaleY(currentDensity)
  
  // Reference temperature line (15°C)
  const referenceX = scaleX(15)

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Зависимость плотности от температуры
          </h3>
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            style={{ minWidth: '600px' }}
          >
            <defs>
              <linearGradient id={`gradient-${gasType}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={chartColor} stopOpacity="0.2" />
                <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = height - chartPadding.bottom - ratio * chartHeight
              return (
                <line
                  key={`grid-${ratio}`}
                  x1={chartPadding.left}
                  y1={y}
                  x2={width - chartPadding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="text-neutral-200 dark:text-neutral-700"
                />
              )
            })}
            
            {/* Reference temperature line (15°C) */}
            <g>
              <line
                x1={referenceX}
                y1={chartPadding.top}
                x2={referenceX}
                y2={height - chartPadding.bottom}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="text-amber-500 dark:text-amber-400"
                opacity="0.5"
              />
              <text
                x={referenceX + 5}
                y={chartPadding.top + 15}
                className="text-xs font-medium fill-amber-600 dark:fill-amber-400"
              >
                15°C (референс)
              </text>
            </g>

            {/* Area fill */}
            <path
              d={fillPathD}
              fill={`url(#gradient-${gasType})`}
            />

            {/* Main line */}
            <path
              d={pathD}
              fill="none"
              stroke={chartColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Current point marker */}
            <g>
              <circle
                cx={currentX}
                cy={currentY}
                r="8"
                fill={chartColor}
              />
              <circle
                cx={currentX}
                cy={currentY}
                r="14"
                fill={chartColor}
                fillOpacity="0.2"
              >
                <animate
                  attributeName="r"
                  values="14;18;14"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0;0.2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* X-axis labels */}
            {[-40, -20, 0, 20, 40].map((temp) => {
              const x = scaleX(temp)
              return (
                <text
                  key={`x-label-${temp}`}
                  x={x}
                  y={height - chartPadding.bottom + 25}
                  textAnchor="middle"
                  className="text-xs fill-neutral-600 dark:fill-neutral-400"
                >
                  {temp}°C
                </text>
              )
            })}

            {/* Y-axis labels */}
            {[0, 0.5, 1].map((ratio) => {
              const density = (minDensity - padding) + ratio * (maxDensity - minDensity + 2 * padding)
              const y = height - chartPadding.bottom - ratio * chartHeight
              return (
                <text
                  key={`y-label-${ratio}`}
                  x={chartPadding.left - 10}
                  y={y + 5}
                  textAnchor="end"
                  className="text-xs fill-neutral-600 dark:fill-neutral-400"
                >
                  {density.toFixed(3)}
                </text>
              )
            })}

            {/* Axis titles */}
            <text
              x={width / 2}
              y={height - 5}
              textAnchor="middle"
              className="text-xs font-medium fill-neutral-700 dark:fill-neutral-300"
            >
              Температура (°C)
            </text>
            <text
              x={15}
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90, 15, ${height / 2})`}
              className="text-xs font-medium fill-neutral-700 dark:fill-neutral-300"
            >
              Плотность (кг/л)
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
