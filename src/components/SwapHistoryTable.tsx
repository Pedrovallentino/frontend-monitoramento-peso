import React from 'react';
import { useGasStore } from '../store/useGasStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, Clock } from 'lucide-react';

export const SwapHistoryTable: React.FC = () => {
  const { history, settings } = useGasStore();

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
        <History className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-500 dark:text-gray-400">Nenhum histórico de troca registrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <History className="text-blue-500" />
        <h3 className="font-semibold text-gray-800 dark:text-white">Histórico de Trocas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Peso Inicial</th>
              <th className="px-4 py-3 font-medium">Peso Final (Antigo)</th>
              <th className="px-4 py-3 font-medium">Duração</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                  {format(new Date(record.date), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {record.initialWeight.toFixed(2)} {settings.unit}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {record.finalWeight.toFixed(2)} {settings.unit}
                </td>
                <td className="px-4 py-3 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock size={14} />
                  {record.durationDays} dias
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
