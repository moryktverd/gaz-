import React from 'react'
import { Droplets, Thermometer, TrendingUp, TrendingDown } from 'lucide-react'
import type { GasType, DensityUnit } from '../types/propane'
import { GAS_PROPERTIES, formatDensity, formatTemperature, calculateDensityDelta, getUnitDisplay, convertDensity } from '../utils/propaneCalculations'

interface DensityDisplayProps {
  temperature: number
  density: number
  gasType: GasType
  mixturePropanePercent: number
  densityUnit: DensityUnit
  onUnitChange: (unit: DensityUnit) => void
}

export function DensityDisplay({ temperature, density, gasType, mixturePropanePercent, densityUnit, onUnitChange }: DensityDisplayProps) {
  const gasProps = GAS_PROPERTIES[gasType]
  const delta = calculateDensityDelta(density, gasType, mixturePropanePercent)
  const displayDensity = convertDensity(density, 'kg/L', densityUnit)
  const displayDelta = convertDensity(Math.abs(delta), 'kg/L', densityUnit)
  const isDeltaPositive = delta > 0
  const isDeltaNegligible = Math.abs(delta) < 0.001
  
  const availableUnits: DensityUnit[] = ['kg/L', 'g/cm³', 'kg/m³', 'lb/gal']

  return (
    <div className={`relative overflow-hidden rounded-3xl ${gasProps.gradient} border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm shadow-sm`}>
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Текущая плотность
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {gasProps.name}
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${gasProps.color} bg-opacity-10`}>
            <span className={`text-xs font-semibold bg-gradient-to-r ${gasProps.color} bg-clip-text text-transparent`}>
              {gasType.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl sm:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {formatDensity(density, densityUnit)}
              </span>
              <div className="flex flex-col gap-1">
                <select
                  value={densityUnit}
                  onChange={(e) => onUnitChange(e.target.value as DensityUnit)}
                  className="text-lg font-medium text-neutral-500 dark:text-neutral-400 bg-transparent border border-neutral-300 dark:border-neutral-600 rounded-lg px-2 py-1 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                >
                  {availableUnits.map(unit => (
                    <option key={unit} value={unit}>{getUnitDisplay(unit)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {!isDeltaNegligible && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                isDeltaPositive
                  ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
              }`}>
                {isDeltaPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {isDeltaPositive ? '+' : '-'}{formatDensity(displayDelta, densityUnit)} от 15°C
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
            <Thermometer className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              при температуре
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {formatTemperature(temperature)}
            </span>
          </div>
        </div>

        {/* Decorative gradient orb */}
        <div className={`absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br ${gasProps.color} rounded-full opacity-5 blur-3xl`} />
      </div>
    </div>
  )
}
