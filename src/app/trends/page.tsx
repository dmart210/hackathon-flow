'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, AreaChart, Area, Pie } from 'recharts';
import Link from 'next/link';

interface InventoryItem {
  id: number;
  name: string;
  on_hand: number;
  cost_per_unit: string;
  supplier_name: string;
}

interface WasteLogItem {
  id: number;
  item_name: string;
  quantity_wasted: number;
  reason: string;
  logged_at: string;
}

interface Supplier {
  id: number;
  name: string;
  contact_info: string;
}

export default function TrendsDemo() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [wasteLog, setWasteLog] = useState<WasteLogItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, wasteRes, suppliersRes] = await Promise.all([
          fetch(`${BACKEND_URL}/inventory`),
          fetch(`${BACKEND_URL}/waste`),
          fetch(`${BACKEND_URL}/suppliers`)
        ]);

        const inventoryData = await inventoryRes.json();
        const wasteData = await wasteRes.json();
        const suppliersData = await suppliersRes.json();

        setInventory(inventoryData);
        setWasteLog(wasteData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Data processing for different trend analyses
  const processInventoryTrends = () => {
    return inventory.map(item => ({
      name: item.name.split(' ').slice(0, 2).join(' '), // Shortened name
      stock: item.on_hand,
      value: parseFloat(item.cost_per_unit) * item.on_hand,
      costPerUnit: parseFloat(item.cost_per_unit),
      status: item.on_hand < 15 ? 'Low' : item.on_hand < 30 ? 'Medium' : 'High'
    }));
  };

  const processWasteTrends = () => {
    const wasteByItem = wasteLog.reduce((acc, item) => {
      const existing = acc.find(w => w.name === item.item_name);
      if (existing) {
        existing.totalWasted += item.quantity_wasted;
        existing.incidents += 1;
      } else {
        acc.push({
          name: item.item_name.split(' ').slice(0, 2).join(' '),
          totalWasted: item.quantity_wasted,
          incidents: 1
        });
      }
      return acc;
    }, [] as any[]);

    return wasteByItem.sort((a, b) => b.totalWasted - a.totalWasted);
  };

  const processWasteReasons = () => {
    const reasonCounts = wasteLog.reduce((acc, item) => {
      acc[item.reason] = (acc[item.reason] || 0) + item.quantity_wasted;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(reasonCounts).map(([reason, count]) => ({
      name: reason,
      value: count
    }));
  };

  const processSupplierPerformance = () => {
    return suppliers.map(supplier => {
      const supplierItems = inventory.filter(item => item.supplier_name === supplier.name);
      const totalValue = supplierItems.reduce((sum, item) => 
        sum + (parseFloat(item.cost_per_unit) * item.on_hand), 0
      );
      const totalStock = supplierItems.reduce((sum, item) => sum + item.on_hand, 0);
      
      return {
        name: supplier.name,
        items: supplierItems.length,
        totalValue: totalValue,
        totalStock: totalStock,
        avgCost: supplierItems.length > 0 ? totalValue / totalStock : 0
      };
    });
  };

  const calculateMetrics = () => {
    const totalWaste = wasteLog.reduce((sum, item) => sum + item.quantity_wasted, 0);
    const totalInventoryValue = inventory.reduce((sum, item) => 
      sum + (parseFloat(item.cost_per_unit) * item.on_hand), 0
    );
    const lowStockItems = inventory.filter(item => item.on_hand < 15).length;
    const wasteByValue = wasteLog.reduce((sum, waste) => {
      const item = inventory.find(inv => inv.name === waste.item_name);
      return sum + (item ? parseFloat(item.cost_per_unit) * waste.quantity_wasted : 0);
    }, 0);

    return {
      totalWaste,
      totalInventoryValue,
      lowStockItems,
      wasteByValue,
      wastePercentage: totalInventoryValue > 0 ? (wasteByValue / totalInventoryValue) * 100 : 0
    };
  };

  const metrics = calculateMetrics();
  const inventoryTrends = processInventoryTrends();
  const wasteTrends = processWasteTrends();
  const wasteReasons = processWasteReasons();
  const supplierPerformance = processSupplierPerformance();

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Trends & Analytics</h1>
              <p className="text-gray-600">Real-time insights from your PostgreSQL database</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Waste</p>
                <p className="text-2xl font-bold text-red-600">{metrics.totalWaste}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-green-600">£{metrics.totalInventoryValue.toFixed(0)}</p>
                <p className="text-xs text-gray-500">total stock</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.lowStockItems}</p>
                <p className="text-xs text-gray-500">items</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waste Cost</p>
                <p className="text-2xl font-bold text-red-600">£{metrics.wasteByValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">lost value</p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waste %</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.wastePercentage.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">of total value</p>
              </div>
              <PieChart className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inventory Stock Levels */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Inventory Stock Levels
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'stock' ? `${value} units` : `£${value}`,
                  name === 'stock' ? 'Stock Level' : 'Total Value'
                ]} />
                <Bar dataKey="stock" fill="#22c55e" name="stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Waste by Item */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Waste by Item
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wasteTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value} ${name === 'totalWasted' ? 'units' : 'incidents'}`,
                  name === 'totalWasted' ? 'Total Wasted' : 'Incidents'
                ]} />
                <Bar dataKey="totalWasted" fill="#ef4444" name="totalWasted" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Waste Reasons Breakdown - Hover-Interactive Design */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-500" />
              Waste Reasons Analysis
              <span className="text-sm text-gray-500 font-normal ml-2">(Hover to explore)</span>
            </h3>
            
            <div className="flex justify-center">
              <ResponsiveContainer width={400} height={400}>
                <RechartsPieChart>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div style={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
                            <p style={{ margin: '4px 0 0 0', color: '#fbbf24' }}>{data.value} units wasted</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Pie 
                    data={wasteReasons} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={140}
                    innerRadius={60}
                    paddingAngle={3}
                    strokeWidth={2}
                    stroke="white"
                  >
                    {wasteReasons.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats Only */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {wasteReasons.reduce((sum, r) => sum + r.value, 0)}
                  </div>
                  <div className="text-sm text-red-700 font-medium">Total Units Wasted</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {wasteReasons.length}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">Different Waste Types</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {wasteReasons.length > 0 ? wasteReasons.sort((a, b) => b.value - a.value)[0]?.name.split(' ')[0] : 'N/A'}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Top Waste Category</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500 italic">
              Hover over pie chart segments to see detailed waste reasons
            </div>
          </div>

          {/* Supplier Performance */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Supplier Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'totalValue' ? `£${value.toFixed(2)}` : `${value}`,
                  name === 'totalValue' ? 'Total Value' : name === 'items' ? 'Items' : 'Total Stock'
                ]} />
                <Bar dataKey="totalValue" fill="#3b82f6" name="totalValue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Inventory Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Current Inventory</h3>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-right py-2">Stock</th>
                    <th className="text-right py-2">Cost</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 font-medium">{item.name}</td>
                      <td className="text-right py-2">{item.on_hand}</td>
                      <td className="text-right py-2">£{item.cost_per_unit}</td>
                      <td className="text-center py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.on_hand < 15 
                            ? 'bg-red-100 text-red-800' 
                            : item.on_hand < 30 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.on_hand < 15 ? 'Low' : item.on_hand < 30 ? 'Medium' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Waste Log - Matching Height */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Recent Waste Log
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1">
              {wasteLog.map(waste => (
                <div key={waste.id} className="border-l-4 border-red-500 bg-red-50 rounded-r p-3 hover:bg-red-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 text-sm">{waste.item_name}</span>
                      <div className="text-sm text-red-700 font-medium mt-1">
                        Quantity Wasted: <span className="text-red-600 font-bold">{waste.quantity_wasted}</span> units
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {new Date(waste.logged_at).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded p-2 text-xs text-gray-700">
                    <span className="font-medium">Reason:</span> {waste.reason}
                  </div>
                </div>
              ))}
              {wasteLog.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No waste entries found</p>
                </div>
              )}
            </div>
          </div>

          {/* Supplier Directory - Matching Height */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Supplier Directory</h3>
            <div className="space-y-4 overflow-y-auto flex-1">
              {suppliers.map(supplier => {
                const supplierItems = inventory.filter(item => item.supplier_name === supplier.name);
                return (
                  <div key={supplier.id} className="border rounded p-4">
                    <h4 className="font-semibold text-blue-600">{supplier.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{supplier.contact_info}</p>
                    <div className="text-xs text-gray-500">
                      <p>Items supplied: {supplierItems.length}</p>
                      <p>Total stock: {supplierItems.reduce((sum, item) => sum + item.on_hand, 0)} units</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">📊 Data Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Inventory Insights:</h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Total inventory value: £{metrics.totalInventoryValue.toFixed(2)}</li>
                <li>{metrics.lowStockItems} items need restocking</li>
                <li>Highest value item: {inventoryTrends.sort((a, b) => b.value - a.value)[0]?.name}</li>
                <li>{suppliers.length} active suppliers in system</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Waste Insights:</h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Total waste: {metrics.totalWaste} units</li>
                <li>Waste cost impact: £{metrics.wasteByValue.toFixed(2)}</li>
                <li>Waste percentage: {metrics.wastePercentage.toFixed(1)}% of inventory value</li>
                <li>Most wasted: {wasteTrends[0]?.name} ({wasteTrends[0]?.totalWasted} units)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Database Connection Info */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">🐳 Data Source</h4>
          <p className="text-gray-600 text-sm">
            All data is live from your PostgreSQL Docker container on port 5432.
            Backend API serves data from <code className="bg-gray-200 px-1 rounded">http://localhost:8080/api</code>
          </p>
          <div className="mt-2 flex gap-4 text-xs text-gray-500">
            <span>📊 {inventory.length} inventory items</span>
            <span>📝 {wasteLog.length} waste log entries</span>
            <span>🏢 {suppliers.length} suppliers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
