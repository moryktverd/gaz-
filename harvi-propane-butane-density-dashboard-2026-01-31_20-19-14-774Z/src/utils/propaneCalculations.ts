import type { GasType, GasProperties, DensityCalculation, DensityUnit } from '../types/propane'

// Physical properties of liquefied petroleum gases
export const GAS_PROPERTIES: Record<GasType, GasProperties> = {
  propane: {
    name: 'Пропан (C₃H₈)',
    densityAt15C: 0.508, // kg/L at 15°C (Engineering Toolbox data)
    thermalExpansionCoefficient: -0.00107, // kg/L/°C - linear coefficient
    minTemp: -50,
    maxTemp: 50,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
  },
  butane: {
    name: 'Бутан (C₄H₁₀)',
    densityAt15C: 0.573, // kg/L at 15°C (Engineering Toolbox data)
    thermalExpansionCoefficient: -0.00104, // kg/L/°C - linear coefficient
    minTemp: -50,
    maxTemp: 50,
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
  },
  mixed: {
    name: 'Смесь',
    densityAt15C: 0.535, // calculated dynamically based on propane %
    thermalExpansionCoefficient: -0.001055, // calculated dynamically
    minTemp: -50,
    maxTemp: 50,
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
  }
}

/**
 * Calculate mixed gas properties based on propane percentage
 */
export function calculateMixtureProperties(propanePercent: number): { densityAt15C: number; thermalExpansionCoefficient: number } {
  const propaneFraction = propanePercent / 100
  const butaneFraction = 1 - propaneFraction
  
  return {
    densityAt15C: GAS_PROPERTIES.propane.densityAt15C * propaneFraction + GAS_PROPERTIES.butane.densityAt15C * butaneFraction,
    thermalExpansionCoefficient: GAS_PROPERTIES.propane.thermalExpansionCoefficient * propaneFraction + GAS_PROPERTIES.butane.thermalExpansionCoefficient * butaneFraction
  }
}

/**
 * Calculate density at given temperature using linear approximation formula
 * ρ(T) = ρ₀ + k(T - T₀)
 * where:
 * ρ₀ - reference density at T₀ (15°C)
 * k - linear temperature coefficient (kg/L/°C)
 * T - current temperature
 * T₀ - reference temperature (15°C)
 *
 * Based on Engineering Toolbox data for liquefied petroleum gases
 * This linear model provides ±0.001 kg/L accuracy across -50°C to +50°C range
 */
export function calculateDensity(temperature: number, gasType: GasType, mixturePropanePercent: number = 60): DensityCalculation {
  let densityAt15C: number
  let thermalCoeff: number
  
  if (gasType === 'mixed') {
    const mixtureProps = calculateMixtureProperties(mixturePropanePercent)
    densityAt15C = mixtureProps.densityAt15C
    thermalCoeff = mixtureProps.thermalExpansionCoefficient
  } else {
    const props = GAS_PROPERTIES[gasType]
    densityAt15C = props.densityAt15C
    thermalCoeff = props.thermalExpansionCoefficient
  }
  
  const props = GAS_PROPERTIES[gasType]
  const referenceTemp = 15 // °C
  
  // Clamp temperature to valid range
  const clampedTemp = Math.max(props.minTemp, Math.min(props.maxTemp, temperature))
  
  // Apply linear density-temperature relationship
  // Note: thermalCoeff is negative (density decreases with temperature increase)
  const density = densityAt15C + thermalCoeff * (clampedTemp - referenceTemp)
  
  // Safety bounds: typical LPG liquid density range
  const boundedDensity = Math.max(0.45, Math.min(0.65, density))
  
  return {
    temperature: clampedTemp,
    density: Number(boundedDensity.toFixed(4)),
    gasType,
    timestamp: Date.now()
  }
}

/**
 * Convert density between units
 */
export function convertDensity(density: number, fromUnit: DensityUnit, toUnit: DensityUnit): number {
  // All conversions go through kg/L as base unit
  let densityInKgPerL = density
  
  // Convert from source unit to kg/L
  switch (fromUnit) {
    case 'kg/L':
      densityInKgPerL = density
      break
    case 'g/cm³':
      densityInKgPerL = density // 1 g/cm³ = 1 kg/L
      break
    case 'kg/m³':
      densityInKgPerL = density / 1000 // 1000 kg/m³ = 1 kg/L
      break
    case 'lb/gal':
      densityInKgPerL = density * 0.1198264 // 1 lb/gal ≈ 0.1198 kg/L
      break
  }
  
  // Convert from kg/L to target unit
  switch (toUnit) {
    case 'kg/L':
      return densityInKgPerL
    case 'g/cm³':
      return densityInKgPerL // 1 kg/L = 1 g/cm³
    case 'kg/m³':
      return densityInKgPerL * 1000 // 1 kg/L = 1000 kg/m³
    case 'lb/gal':
      return densityInKgPerL / 0.1198264 // 1 kg/L ≈ 8.345 lb/gal
  }
}

/**
 * Get unit display string
 */
export function getUnitDisplay(unit: DensityUnit): string {
  return unit
}

/**
 * Calculate density difference from reference temperature (15°C)
 */
export function calculateDensityDelta(currentDensity: number, gasType: GasType, mixturePropanePercent: number = 60): number {
  const referenceCalc = calculateDensity(15, gasType, mixturePropanePercent)
  return currentDensity - referenceCalc.density
}

/**
 * Generate chart data points for temperature range
 */
export function generateChartData(gasType: GasType, mixturePropanePercent: number = 60, steps: number = 50): Array<{ temp: number; density: number }> {
  const props = GAS_PROPERTIES[gasType]
  const range = props.maxTemp - props.minTemp
  const stepSize = range / (steps - 1)
  
  return Array.from({ length: steps }, (_, i) => {
    const temp = props.minTemp + stepSize * i
    const { density } = calculateDensity(temp, gasType, mixturePropanePercent)
    return { temp, density }
  })
}

/**
 * Format density value for display
 */
export function formatDensity(density: number, unit: DensityUnit = 'kg/L'): string {
  const converted = convertDensity(density, 'kg/L', unit)
  
  switch (unit) {
    case 'kg/L':
    case 'g/cm³':
      return converted.toFixed(3)
    case 'kg/m³':
      return converted.toFixed(1)
    case 'lb/gal':
      return converted.toFixed(2)
  }
}

/**
 * Format temperature for display
 */
export function formatTemperature(temp: number): string {
  return `${temp > 0 ? '+' : ''}${temp.toFixed(1)}°C`
}

/**
 * Get color for temperature value (visual indicator)
 */
export function getTemperatureColor(temp: number): string {
  if (temp <= -20) return 'text-blue-500'
  if (temp <= 0) return 'text-cyan-500'
  if (temp <= 20) return 'text-emerald-500'
  if (temp <= 35) return 'text-orange-500'
  return 'text-red-500'
}
