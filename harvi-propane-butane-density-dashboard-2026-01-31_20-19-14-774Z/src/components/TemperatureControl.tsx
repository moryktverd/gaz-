import React, { useState, useEffect } from 'react'
import { Thermometer, Plus, Minus } from 'lucide-react'
import { getTemperatureColor } from '../utils/propaneCalculations'

interface TemperatureControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function TemperatureControl({ 
  value, 
  onChange, 
  min = -50, 
  max = 50 
}: TemperatureControlProps) {
  const [localValue, setLocalValue] = useState(value.toString())

  useEffect(() => {
    setLocalValue(value.toString())
  }, [value])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }

  const handleInputBlur = () => {
    const numValue = Number(localValue)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      onChange(clampedValue)
      setLocalValue(clampedValue.toString())
    } else {
      setLocalValue(value.toString())
    }
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1)
    onChange(newValue)
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Thermometer className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Температура окружающей среды
          </h3>
        </div>

        <div className="space-y-6">
          {/* Temperature display with controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleDecrement}
              disabled={value <= min}
              className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Уменьшить температуру"
            >
              <Minus className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>

            <div className="flex items-baseline gap-2">
              <input
                type="text"
                value={localValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-24 text-5xl font-bold text-center bg-transparent border-none outline-none ${getTemperatureColor(value)} dark:text-white`}
                aria-label="Температура"
              />
              <span className="text-3xl font-medium text-neutral-500 dark:text-neutral-400">
                °C
              </span>
            </div>

            <button
              onClick={handleIncrement}
              disabled={value >= max}
              className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Увеличить температуру"
            >
              <Plus className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <div className="relative">
              <input
                type="range"
                min={min}
                max={max}
                step={0.5}
                value={value}
                onChange={handleSliderChange}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${percentage}%, rgb(229 229 229) ${percentage}%, rgb(229 229 229) 100%)`
                }}
                aria-label="Температурный слайдер"
              />
              
              {/* Temperature markers */}
              <div className="absolute -top-2 left-0 right-0 flex justify-between px-1 pointer-events-none">
                {[-50, -25, 0, 25, 50].map((temp) => {
                  const pos = ((temp - min) / (max - min)) * 100
                  return (
                    <div
                      key={temp}
                      className="relative"
                      style={{ marginLeft: pos === 0 ? '0' : pos === 100 ? 'auto' : `${pos}%` }}
                    >
                      <div className={`w-0.5 h-3 ${
                        temp === 0 ? 'bg-blue-500 dark:bg-blue-400' : 'bg-neutral-400 dark:bg-neutral-600'
                      }`} />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>{min}°C</span>
              <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                Диапазон: {min}°C — {max}°C
              </span>
              <span>{max}°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
