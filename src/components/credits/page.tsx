'use client';

import { useState, useEffect } from 'react';
import { CreditCard, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Credit {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description: string;
  metadata?: any;
}

export default function CreditsPage() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/flowglad/credits');
      if (!response.ok) throw new Error('Failed to fetch credits');
      
      const data = await response.json();
      setCredits(data.credits || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load credits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency === 'GBP' ? 'GBP' : 'USD',
    }).format(amount / 100); // FlowGlad amounts are in pence
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FlowGlad Credits</h1>
                <p className="text-gray-600">
                  All waste-related credits processed through FlowGlad
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchCredits}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Credits List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Credit History</h2>
            <p className="text-gray-600 text-sm">
              Real-time credits processed via FlowGlad API
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading credits...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchCredits}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : credits.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No credits processed yet</p>
              <p className="text-gray-400 text-sm">
                Credits will appear here when waste triggers auto-refunds
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {credits.map((credit) => (
                <div key={credit.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatAmount(credit.amount, credit.currency)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {credit.description}
                        </p>
                        <p className="text-gray-400 text-xs">
                          ID: {credit.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(credit.status)}`}>
                        {credit.status}
                      </span>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(credit.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {credit.metadata && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border text-sm">
                      <p><strong>Waste Type:</strong> {credit.metadata.wasteType}</p>
                      <p><strong>Waste Amount:</strong> {credit.metadata.wasteAmount} units</p>
                      <p><strong>Source:</strong> {credit.metadata.source}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
