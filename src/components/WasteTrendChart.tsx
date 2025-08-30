'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WasteDataPoint } from '@/lib/data-simulator';

interface WasteTrendChartProps {
  data: WasteDataPoint[];
}

export function WasteTrendChart({ data }: WasteTrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Waste Trend (Last 7 Hours)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="noodles" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Noodles"
          />
          <Line 
            type="monotone" 
            dataKey="broth" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Broth"
          />
          <Line 
            type="monotone" 
            dataKey="chicken" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Chicken"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
