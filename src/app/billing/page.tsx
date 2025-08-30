'use client';

import { useState, useEffect } from 'react';
import { CreditCard, ArrowLeft, RefreshCw, DollarSign, TrendingUp, Calendar, FileText, Download, Activity, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface BillingData {
  currentUsage: {
    credits_used: number;
    credits_remaining: number;
    period_start: string;
    period_end: string;
  };
  invoices: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    due_date: string;
    description: string;
    invoice_url?: string;
  }>;
  subscription: {
    plan_name: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    price: number;
    currency: string;
  };
  paymentMethods: Array<{
    id: string;
    type: string;
    last4: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    is_default: boolean;
  }>;
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/flowglad/billing');
      if (!response.ok) throw new Error('Failed to fetch billing data');
      
      const data = await response.json();
      setBillingData(data.billing);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const formatAmount = (amount: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency === 'GBP' ? 'GBP' : 'USD',
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': case 'active': return 'text-green-600 bg-green-100';
      case 'pending': case 'trialing': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': case 'past_due': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getUsagePercentage = () => {
    if (!billingData?.currentUsage) return 0;
    const { credits_used, credits_remaining } = billingData.currentUsage;
    const total = credits_used + credits_remaining;
    return total > 0 ? (credits_used / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading FlowGlad billing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Billing</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchBillingData}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link 
              href="/"
              className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FlowGlad Billing
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Manage your subscription and view usage analytics
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">FlowGlad Connected</span>
              </div>
              <button
                onClick={fetchBillingData}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all shadow-lg"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {billingData && (
          <>
            {/* Usage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Credits Used</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {billingData.currentUsage.credits_used.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {billingData.currentUsage.credits_remaining.toLocaleString()} remaining
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                      {billingData.subscription.plan_name}
                    </p>
                    <p className="text-lg text-gray-600">
                      {formatAmount(billingData.subscription.price, billingData.subscription.currency)}/month
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Billing Period</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(billingData.currentUsage.period_start).toLocaleDateString()} - 
                      {new Date(billingData.currentUsage.period_end).toLocaleDateString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(billingData.subscription.status)}`}>
                      {billingData.subscription.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Invoices</h2>
                <p className="text-gray-600">Your FlowGlad billing history and payment records</p>
              </div>

              <div className="divide-y divide-gray-100">
                {billingData.invoices.map((invoice) => (
                  <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatAmount(invoice.amount, invoice.currency)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {invoice.description}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Invoice #{invoice.id.substring(0, 8)}... • Due: {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                        {invoice.invoice_url && (
                          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Methods</h2>
                <p className="text-gray-600">Manage your payment methods for FlowGlad services</p>
              </div>

              <div className="p-8">
                {billingData.paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {billingData.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {method.brand.toUpperCase()} •••• {method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {method.exp_month.toString().padStart(2, '0')}/{method.exp_year}
                            </p>
                          </div>
                        </div>
                        {method.is_default && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No payment methods on file</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Powered by{' '}
            <a href="https://flowglad.com" className="text-blue-600 hover:text-blue-700 font-semibold">
              FlowGlad Payment Processing
            </a>
            {' '}• Secure and compliant billing
          </p>
        </div>
      </div>
    </div>
  );
}
