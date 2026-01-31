export type GasType = 'propane' | 'butane' | 'mixed'

export type DensityUnit = 'kg/L' | 'g/cm³' | 'kg/m³' | 'lb/gal'

export interface GasProperties {
  name: string
  densityAt15C: number // kg/L
  thermalExpansionCoefficient: number // 1/°C
  minTemp: number // °C
  maxTemp: number // °C
  color: string
  gradient: string
}

export interface DensityCalculation {
  temperature: number
  density: number
  gasType: GasType
  timestamp: number
}

export interface MeasurementRecord {
  id: string
  temperature: number
  density: number
  gasType: GasType
  timestamp: number
}

export interface PropaneState {
  currentTemperature: number
  gasType: GasType
  mixturePropanePercent: number // 0-100, used when gasType === 'mixed'
  densityUnit: DensityUnit
  measurements: MeasurementRecord[]
}
