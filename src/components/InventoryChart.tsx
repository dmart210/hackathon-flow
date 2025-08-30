'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InventoryItem } from '@/lib/data-simulator';

interface InventoryChartProps {
  data: InventoryItem[];
}

export function InventoryChart({ data }: InventoryChartProps) {
  const chartData = data.map(item => ({
    name: item.ingredient.split(' ')[0], // Short name for chart
    inventory: item.on_hand,
    waste: item.waste_today
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Current Inventory</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="inventory" fill="#22c55e" name="On Hand" />
          <Bar dataKey="waste" fill="#ef4444" name="Wasted Today" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
