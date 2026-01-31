import React from 'react'
import { Flame } from 'lucide-react'
import type { GasType } from '../types/propane'
import { GAS_PROPERTIES } from '../utils/propaneCalculations'

interface GasTypeSelectorProps {
  selected: GasType
  onChange: (type: GasType) => void
  mixturePropanePercent: number
  onMixturePercentChange: (percent: number) => void
}

export function GasTypeSelector({ selected, onChange, mixturePropanePercent, onMixturePercentChange }: GasTypeSelectorProps) {
  const gasTypes: GasType[] = ['propane', 'butane', 'mixed']

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Тип газа
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {gasTypes.map((type) => {
            const props = GAS_PROPERTIES[type]
            const isSelected = selected === type

            return (
              <button
                key={type}
                onClick={() => onChange(type)}
                className={`
                  relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/50'
                  }
                `}
              >
                <div className="relative z-10">
                  <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold mb-2 bg-gradient-to-r ${props.color} bg-opacity-10`}>
                    <span className={`bg-gradient-to-r ${props.color} bg-clip-text text-transparent`}>
                      {type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                      {props.name.split('(')[0].trim()}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {props.densityAt15C.toFixed(3)} кг/л при 15°C
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                )}
              </button>
            )
          })}
        </div>

        {selected === 'mixed' && (
          <div className="mt-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Состав смеси
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">C₃H₈</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {mixturePropanePercent}%
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">/</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {100 - mixturePropanePercent}%
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">C₄H₁₀</span>
              </div>
            </div>
            
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={mixturePropanePercent}
              onChange={(e) => onMixturePercentChange(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${mixturePropanePercent}%, rgb(16 185 129) ${mixturePropanePercent}%, rgb(16 185 129) 100%)`
              }}
              aria-label="Процент пропана в смеси"
            />
            
            <div className="flex justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>100% бутан</span>
              <span>50/50</span>
              <span>100% пропан</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
