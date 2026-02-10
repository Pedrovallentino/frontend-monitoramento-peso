import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGasStore } from '../store/useGasStore';
import { format } from 'date-fns';

export const WeightChart: React.FC = () => {
  const { readings, settings } = useGasStore();

  const data = readings.map(r => ({
    time: r.timestamp,
    weight: r.weight,
    formattedTime: format(new Date(r.timestamp), 'HH:mm:ss')
  }));

  if (data.length < 2) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center justify-center h-64">
        <p className="text-gray-400">Aguardando dados para gerar gráfico...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Evolução do Peso</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="formattedTime" 
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 'auto']} // Or domain={[settings.tareWeight, 'auto']}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              unit={settings.unit}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
              itemStyle={{ color: '#F9FAFB' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#0ea5e9" 
              fill="#e0f2fe" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
