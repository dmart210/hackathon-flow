'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Hash } from 'lucide-react';

interface ApiActivity {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  timestamp: string;
  creditId?: string;
}

export function FlowGladApiMonitor() {
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate real-time API activities for demo
    const generateActivity = () => {
      const endpoints = [
        '/api/waste-credits',
        '/api/flowglad/credits',
        '/api/honcho'
      ];
      
      const methods = ['POST', 'GET'];
      const statuses = [200, 201];
      
      const newActivity: ApiActivity = {
        id: `api_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
        method: methods[Math.floor(Math.random() * methods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        responseTime: Math.floor(Math.random() * 500) + 100,
        timestamp: new Date().toISOString(),
        creditId: Math.random() > 0.5 ? `wc_${Date.now()}_${Math.random().toString(36).substr(2, 8)}` : undefined
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]); // Keep last 5 activities
    };

    // Generate initial activity
    generateActivity();

    // Generate activity every 5-8 seconds for demo
    const interval = setInterval(() => {
      generateActivity();
    }, Math.random() * 3000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Activity className="w-5 h-5 text-blue-600" />
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-blue-900">FlowGlad API Monitor</h3>
          <p className="text-xs text-blue-700">Live API Communication</p>
        </div>
      </div>

      <div className="space-y-2">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="bg-white/70 p-3 rounded-lg border border-blue-100 animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-blue-500" />
                <span className="font-mono text-xs text-blue-800">
                  {activity.method} {activity.endpoint}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 200 ? 'bg-green-500' : 
                  activity.status === 201 ? 'bg-blue-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs font-mono text-gray-600">{activity.status}</span>
              </div>
            </div>
            
            {activity.creditId && (
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-3 h-3 text-purple-500" />
                <span className="text-xs font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  {activity.creditId}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(activity.timestamp).toLocaleTimeString('en-GB')}</span>
              </div>
              <span className="font-mono">{activity.responseTime}ms</span>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-4">
          <Activity className="w-8 h-8 text-blue-300 mx-auto mb-2" />
          <p className="text-xs text-blue-600">Waiting for API activity...</p>
        </div>
      )}
    </div>
  );
}
