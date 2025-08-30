'use client';

import { useState, useEffect } from 'react';
import { CreditCard, ArrowLeft, RefreshCw, TrendingUp, DollarSign, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

interface Credit {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description: string;
  metadata?: {
    wasteType?: string;
    wasteAmount?: number;
    source?: string;
    location?: string;
  };
}

interface CreditSummary {
  totalCredits: number;
  totalAmount: number;
  currency: string;
  thisMonth: number;
  lastMonth: number;
}

export default function CreditsPage() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCreditNotification, setNewCreditNotification] = useState<string | null>(null);
  const [lastCreditCount, setLastCreditCount] = useState(0);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/flowglad/credits');
      if (!response.ok) throw new Error('Failed to fetch credits');
      
      const data = await response.json();
      const newCredits = data.credits || [];
      
      // Check for new credits and show notification
      if (newCredits.length > lastCreditCount && lastCreditCount > 0) {
        const newCredit = newCredits[0]; // Most recent credit
        setNewCreditNotification(newCredit.id);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          setNewCreditNotification(null);
        }, 3000);
      }
      
      setCredits(newCredits);
      setSummary(data.summary || null);
      setLastCreditCount(newCredits.length);
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

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'GBP',
    }).format(amount / 100); // FlowGlad amounts are in cents
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWasteTypeIcon = (wasteType?: string) => {
    switch (wasteType?.toLowerCase()) {
      case 'food': return '🍜';
      case 'packaging': return '📦';
      case 'general': return '🗑️';
      default: return '♻️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      
      {/* Real-time Credit Notification */}
      {newCreditNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 transform animate-bounce">
          <CreditCard className="w-5 h-5" />
          <div>
            <div className="font-semibold">New FlowGlad Credit!</div>
            <div className="text-sm opacity-90">Credit processed in real-time</div>
          </div>
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  FlowGlad Credits
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Real-time waste credit processing via FlowGlad API
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">FlowGlad Connected</span>
              </div>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchCredits();
                }}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 transition-all shadow-lg"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh Credits
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Credits</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatAmount(summary.totalAmount, summary.currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalCredits}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatAmount(summary.thisMonth, summary.currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Growth</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.lastMonth > 0 
                      ? `+${Math.round(((summary.thisMonth - summary.lastMonth) / summary.lastMonth) * 100)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credits List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Credit Transaction History</h2>
            <p className="text-gray-600">
              Real-time credits processed automatically through FlowGlad when waste is logged
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-6 text-lg">Loading FlowGlad credits...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <button
                onClick={fetchCredits}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : credits.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Credits Yet</h3>
              <p className="text-gray-500 mb-2">
                Credits will automatically appear here when waste is logged
              </p>
              <p className="text-gray-400 text-sm">
                FlowGlad processes refunds in real-time for waste incidents
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {credits.map((credit) => (
                <div 
                  key={credit.id} 
                  className={`p-6 transition-all duration-500 ${
                    newCreditNotification === credit.id 
                      ? 'bg-green-50 border-l-4 border-l-green-500 hover:bg-green-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        newCreditNotification === credit.id 
                          ? 'bg-green-200 ring-2 ring-green-300' 
                          : 'bg-green-100'
                      }`}>
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-xl font-bold text-gray-900">
                            {formatAmount(credit.amount, credit.currency)}
                          </p>
                          {newCreditNotification === credit.id && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                              ✨ New!
                            </span>
                          )}
                          {credit.metadata?.wasteType && (
                            <span className="text-lg">
                              {getWasteTypeIcon(credit.metadata.wasteType)}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">
                          {credit.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>ID: {credit.id.substring(0, 8)}...</span>
                          <span>•</span>
                          <span>{new Date(credit.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(credit.status)}`}>
                        {credit.status.charAt(0).toUpperCase() + credit.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {credit.metadata && (
                    <div className="mt-4 ml-16 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold text-gray-700 mb-2">Transaction Details</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {credit.metadata.wasteType && (
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <p className="font-medium capitalize">{credit.metadata.wasteType}</p>
                          </div>
                        )}
                        {credit.metadata.wasteAmount && (
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <p className="font-medium">{credit.metadata.wasteAmount} units</p>
                          </div>
                        )}
                        {credit.metadata.location && (
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <p className="font-medium">{credit.metadata.location}</p>
                          </div>
                        )}
                        {credit.metadata.source && (
                          <div>
                            <span className="text-gray-500">Source:</span>
                            <p className="font-medium">{credit.metadata.source}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Powered by{' '}
            <a href="https://flowglad.com" className="text-green-600 hover:text-green-700 font-semibold">
              FlowGlad API
            </a>
            {' '}• Real-time waste credit processing
          </p>
        </div>
      </div>
    </div>
  );
}
