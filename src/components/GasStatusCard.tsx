import React from 'react';
import { Fuel } from 'lucide-react';
import { calculatePercentage, getStatusColor, getStatusText } from '../utils/gasHelpers';
import { useGasStore } from '../store/useGasStore';
import clsx from 'clsx';

interface GasStatusCardProps {
  currentWeight: number;
}

export const GasStatusCard: React.FC<GasStatusCardProps> = ({ currentWeight }) => {
  const { settings } = useGasStore();
  const percentage = calculatePercentage(currentWeight, settings.tareWeight, settings.netWeight);
  const color = getStatusColor(percentage);
  const statusText = getStatusText(percentage);

  // Calculate gas weight only
  const gasWeight = Math.max(0, currentWeight - settings.tareWeight);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Status do Botijão</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitoramento em tempo real</p>
        </div>
        <div 
          className={clsx("p-2 rounded-full", {
            "bg-green-100 text-green-600": percentage > 40,
            "bg-yellow-100 text-yellow-600": percentage > 20 && percentage <= 40,
            "bg-red-100 text-red-600": percentage <= 20,
          })}
        >
          <Fuel size={24} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-48 h-48">
          {/* Circular Progress Background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Circular Progress Foreground */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={color}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 dark:text-white">
              {percentage.toFixed(0)}%
            </span>
            <span className="text-sm text-gray-500 font-medium">{statusText}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Peso Total</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {currentWeight.toFixed(2)} <span className="text-sm font-normal">{settings.unit}</span>
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Gás Restante</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {gasWeight.toFixed(2)} <span className="text-sm font-normal">{settings.unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
