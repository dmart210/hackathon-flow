'use client';

import { useState, useEffect } from 'react';
import { Shield, Key, CheckCircle, Wifi } from 'lucide-react';

export function FlowGladDemoBanner() {
  const [apiKey, setApiKey] = useState<string>('');
  const [lastTransactionId, setLastTransactionId] = useState<string>('');

  useEffect(() => {
    // Show partial API key for demo (hiding sensitive parts)
    setApiKey('sk_test_2UmCX4sLhSFxmEcVB4wLDxNEeMoqAQ5gckppoCwSvVYSUo');
    
    // Simulate getting the latest transaction ID
    const generateTransactionId = () => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      setLastTransactionId(`wc_${timestamp}_${randomId}`);
    };

    generateTransactionId();
    
    // Update transaction ID every 10 seconds for demo
    const interval = setInterval(generateTransactionId, 10000);
    return () => clearInterval(interval);
  }, []);

  const maskedApiKey = apiKey ? `${apiKey.slice(0, 15)}${'*'.repeat(15)}${apiKey.slice(-10)}` : '';

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* API Connection Status */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Wifi className="w-5 h-5 text-green-200" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              </div>
              <span className="font-semibold">FlowGlad Connected</span>
            </div>
            
            {/* API Key Display */}
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-green-200" />
              <span className="text-sm">
                <span className="font-medium">API Key:</span>
                <span className="font-mono ml-2 bg-green-700 px-2 py-1 rounded text-xs">
                  {maskedApiKey}
                </span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Latest Transaction */}
            {lastTransactionId && (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-200" />
                <span className="text-sm">
                  <span className="font-medium">Latest TX:</span>
                  <span className="font-mono ml-2 bg-green-700 px-2 py-1 rounded text-xs">
                    {lastTransactionId}
                  </span>
                </span>
              </div>
            )}
            
            {/* Status */}
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-200" />
              <span className="text-sm font-medium">Live Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
