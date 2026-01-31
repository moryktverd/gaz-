import { useState, useEffect, useCallback } from 'react'
import type { GasType, MeasurementRecord, PropaneState, DensityUnit } from '../types/propane'
import { calculateDensity } from '../utils/propaneCalculations'

const STORAGE_KEY = 'propane-dashboard-state'
const MAX_MEASUREMENTS = 50

function loadState(): PropaneState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as PropaneState
      return {
        currentTemperature: parsed.currentTemperature ?? 15,
        gasType: parsed.gasType ?? 'propane',
        mixturePropanePercent: parsed.mixturePropanePercent ?? 60,
        densityUnit: parsed.densityUnit ?? 'kg/L',
        measurements: Array.isArray(parsed.measurements) ? parsed.measurements : []
      }
    }
  } catch (error) {
    console.warn('Failed to load propane state from localStorage:', error)
  }
  
  return {
    currentTemperature: 15,
    gasType: 'propane',
    mixturePropanePercent: 60,
    densityUnit: 'kg/L',
    measurements: []
  }
}

function saveState(state: PropaneState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save propane state to localStorage:', error)
  }
}

export function usePropaneData() {
  const [state, setState] = useState<PropaneState>(loadState)
  const [currentDensity, setCurrentDensity] = useState(() =>
    calculateDensity(state.currentTemperature, state.gasType, state.mixturePropanePercent).density
  )

  // Update current density when temperature, gas type, or mixture changes
  useEffect(() => {
    const { density } = calculateDensity(state.currentTemperature, state.gasType, state.mixturePropanePercent)
    setCurrentDensity(density)
  }, [state.currentTemperature, state.gasType, state.mixturePropanePercent])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state)
  }, [state])

  const setTemperature = useCallback((temperature: number) => {
    setState(prev => ({
      ...prev,
      currentTemperature: temperature
    }))
  }, [])

  const setGasType = useCallback((gasType: GasType) => {
    setState(prev => ({
      ...prev,
      gasType
    }))
  }, [])

  const setMixturePropanePercent = useCallback((percent: number) => {
    setState(prev => ({
      ...prev,
      mixturePropanePercent: Math.max(0, Math.min(100, percent))
    }))
  }, [])

  const setDensityUnit = useCallback((unit: DensityUnit) => {
    setState(prev => ({
      ...prev,
      densityUnit: unit
    }))
  }, [])

  const addMeasurement = useCallback(() => {
    const calculation = calculateDensity(state.currentTemperature, state.gasType, state.mixturePropanePercent)
    
    const newMeasurement: MeasurementRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      temperature: calculation.temperature,
      density: calculation.density,
      gasType: calculation.gasType,
      timestamp: calculation.timestamp
    }

    setState(prev => ({
      ...prev,
      measurements: [newMeasurement, ...prev.measurements].slice(0, MAX_MEASUREMENTS)
    }))
  }, [state.currentTemperature, state.gasType, state.mixturePropanePercent])

  const removeMeasurement = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      measurements: prev.measurements.filter(m => m.id !== id)
    }))
  }, [])

  const clearMeasurements = useCallback(() => {
    setState(prev => ({
      ...prev,
      measurements: []
    }))
  }, [])

  return {
    temperature: state.currentTemperature,
    gasType: state.gasType,
    mixturePropanePercent: state.mixturePropanePercent,
    densityUnit: state.densityUnit,
    density: currentDensity,
    measurements: state.measurements,
    setTemperature,
    setGasType,
    setMixturePropanePercent,
    setDensityUnit,
    addMeasurement,
    removeMeasurement,
    clearMeasurements
  }
}
