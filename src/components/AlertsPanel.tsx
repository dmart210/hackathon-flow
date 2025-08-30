'use client';

import { AlertTriangle, CreditCard, Clock } from 'lucide-react';
import { Alert } from '@/lib/data-simulator';

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'waste':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'stockout':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-green-500" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'waste':
        return 'border-red-200 bg-red-50';
      case 'stockout':
        return 'border-orange-200 bg-orange-50';
      case 'credit':
        return 'border-green-200 bg-green-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Live Alerts & Actions</h3>
      
      {alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No alerts at the moment</p>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.timestamp}</p>
                  {alert.action && (
                    <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm inline-block">
                      ✅ {alert.action}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
