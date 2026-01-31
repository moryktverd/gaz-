import React from 'react'
import { DensityDisplay } from './DensityDisplay'
import { TemperatureControl } from './TemperatureControl'
import { DensityChart } from './DensityChart'
import { GasTypeSelector } from './GasTypeSelector'
import { MeasurementHistory } from './MeasurementHistory'
import { usePropaneData } from '../hooks/usePropaneData'

export function Dashboard() {
  const {
    temperature,
    gasType,
    mixturePropanePercent,
    densityUnit,
    density,
    measurements,
    setTemperature,
    setGasType,
    setMixturePropanePercent,
    setDensityUnit,
    addMeasurement,
    removeMeasurement,
    clearMeasurements
  } = usePropaneData()

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
          Плотность пропан-бутана
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Мониторинг плотности сжиженного газа с учетом температуры окружающей среды
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DensityDisplay
          temperature={temperature}
          density={density}
          gasType={gasType}
          mixturePropanePercent={mixturePropanePercent}
          densityUnit={densityUnit}
          onUnitChange={setDensityUnit}
        />
        
        <TemperatureControl
          value={temperature}
          onChange={setTemperature}
        />
      </div>

      <div className="mb-6">
        <GasTypeSelector
          selected={gasType}
          onChange={setGasType}
          mixturePropanePercent={mixturePropanePercent}
          onMixturePercentChange={setMixturePropanePercent}
        />
      </div>

      <div className="mb-6">
        <DensityChart
          gasType={gasType}
          currentTemperature={temperature}
          currentDensity={density}
          mixturePropanePercent={mixturePropanePercent}
        />
      </div>

      <MeasurementHistory
        measurements={measurements}
        onRemove={removeMeasurement}
        onClear={clearMeasurements}
        onAdd={addMeasurement}
      />
    </div>
  )
}
