'use client';

import { useState, useEffect } from 'react';
import { InventoryChart } from '@/components/InventoryChart';
import { WasteTrendChart } from '@/components/WasteTrendChart';
import { AlertsPanel } from '@/components/AlertsPanel';
import { HonchoMemory } from '@/components/HonchoMemory';
import { FlowGladCredit } from '@/components/FlowGladCredit';
import { FlowGladApiMonitor } from '@/components/FlowGladApiMonitor';
import { FlowGladDemoBanner } from '@/components/FlowGladDemoBanner';
import { 
  getInventoryData, 
  getWasteTrendData, 
  getAlerts,
  type InventoryItem,
  type WasteDataPoint,
  type Alert
} from '@/lib/data-simulator';

export default function Dashboard() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [wasteData, setWasteData] = useState<WasteDataPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Update data every 3 seconds for live demo effect
  useEffect(() => {
    const updateData = () => {
      setInventoryData(getInventoryData());
      setWasteData(getWasteTrendData());
      setAlerts(getAlerts());
      setLastUpdate(new Date().toLocaleTimeString('en-GB'));
    };

    // Initial data load
    updateData();

    // Set up interval for live updates
    const interval = setInterval(updateData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FlowGlad Demo Banner */}
      <FlowGladDemoBanner />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Wagamama</h1>
              <span className="text-lg text-gray-600">Smart Kitchen Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              {/* FlowGlad API Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">FlowGlad API Connected</span>
              </div>
              
              <a 
                href="/credits" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Credits
              </a>
              <a 
                href="/billing" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                FlowGlad Billing
              </a>
              <a 
                href="/trends" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Data Trends
              </a>
              <a 
                href="/why-us" 
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
              >
                Why Us?
              </a>
              <a 
                href="/honcho-test" 
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
              >
                Honcho AI Test
              </a>
              <a 
                href="/api-test" 
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Test API
              </a>
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdate}
                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Row - Charts and API Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <InventoryChart data={inventoryData} />
          <WasteTrendChart data={wasteData} />
          <FlowGladApiMonitor />
        </div>

        {/* Bottom Row - Alerts, Memory, Credits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AlertsPanel alerts={alerts} />
          <HonchoMemory />
          <FlowGladCredit 
            wasteAmount={inventoryData.length > 0 ? inventoryData[0].waste_today : 15}
            wasteType={inventoryData.length > 0 ? inventoryData[0].ingredient : 'noodles'}
            autoTrigger={inventoryData.length > 0 && inventoryData[0].waste_today > 8}
          />
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Total Waste Today</h4>
            <p className="text-2xl font-bold text-red-600">
              {inventoryData.reduce((sum, item) => sum + item.waste_today, 0)} portions
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Cost Impact</h4>
            <p className="text-2xl font-bold text-orange-600">
              £{(inventoryData.reduce((sum, item) => sum + item.waste_today, 0) * 3.2).toFixed(0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Credits Issued</h4>
            <p className="text-2xl font-bold text-green-600">£15</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Efficiency Score</h4>
            <p className="text-2xl font-bold text-blue-600">87%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
