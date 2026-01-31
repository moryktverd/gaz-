import React from 'react'
import { Clock, X, Trash2, Plus } from 'lucide-react'
import type { MeasurementRecord } from '../types/propane'
import { GAS_PROPERTIES, formatDensity, formatTemperature } from '../utils/propaneCalculations'

interface MeasurementHistoryProps {
  measurements: MeasurementRecord[]
  onRemove: (id: string) => void
  onClear: () => void
  onAdd: () => void
}

export function MeasurementHistory({ 
  measurements, 
  onRemove, 
  onClear,
  onAdd 
}: MeasurementHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'только что'
    if (diffMins < 60) return `${diffMins} мин назад`
    if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60)
      return `${hours} ч назад`
    }
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              История измерений
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {measurements.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAdd}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Добавить</span>
            </button>
            {measurements.length > 0 && (
              <button
                onClick={onClear}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Очистить</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          {measurements.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                Нет сохраненных измерений
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Нажмите "Добавить" чтобы сохранить текущее измерение
              </p>
            </div>
          ) : (
            measurements.map((record) => {
              const gasProps = GAS_PROPERTIES[record.gasType]
              
              return (
                <div
                  key={record.id}
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gasProps.color}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {formatDensity(record.density)} кг/л
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        при {formatTemperature(record.temperature)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{gasProps.name.split('(')[0].trim()}</span>
                      <span>•</span>
                      <span>{formatDate(record.timestamp)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(record.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                    aria-label="Удалить запись"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
