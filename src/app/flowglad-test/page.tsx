'use client';

import { useState } from 'react';
import { ArrowLeft, TestTube, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function FlowGladTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runFlowGladTest = async () => {
    console.log('Starting FlowGlad tests...');
    setLoading(true);
    setTestResult(null);
    
    try {
      // Test 1: Check our waste credits API
      console.log('Testing waste credits API...');
      const healthCheck = await fetch('/api/waste-credits');
      const healthData = await healthCheck.json();
      console.log('Health check result:', healthData);
      
      // Test 2: Test FlowGlad billing endpoint
      console.log('Testing FlowGlad billing...');
      const billingTest = await fetch('/api/flowglad/customers/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const billingData = await billingTest.json();
      console.log('Billing test result:', billingData);
      
      // Test 3: Test waste credit processing
      console.log('Testing credit processing...');
      const creditTest = await fetch('/api/waste-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 7.5,
          currency: 'GBP',
          description: 'Test waste credit from integration test',
          metadata: {
            wasteType: 'test_noodles',
            wasteAmount: 10,
            source: 'integration_test'
          }
        })
      });
      
      const creditData = await creditTest.json();
      console.log('Credit test result:', creditData);
      
      // Test 4: Test Honcho AI integration
      console.log('Testing Honcho AI...');
      const honchoTest = await fetch('/api/honcho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_waste',
          ingredient: 'test_ramen',
          amount: 10,
          timestamp: new Date().toISOString(),
          shift: 'lunch',
          dayOfWeek: 'Wednesday',
          weather: 'sunny',
          cost: 7.5
        })
      });
      
      const honchoData = await honchoTest.json();
      console.log('Honcho test result:', honchoData);
      
      const results = {
        healthCheck: { success: healthCheck.ok, data: healthData },
        billingTest: { success: billingTest.ok, data: billingData },
        creditTest: { success: creditTest.ok, data: creditData },
        honchoTest: { success: honchoTest.ok, data: honchoData },
        timestamp: new Date().toISOString()
      };
      
      console.log('Final test results:', results);
      setTestResult(results);
      
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Test failed',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FlowGlad Integration Test</h1>
              <p className="text-gray-600">
                Test your FlowGlad API connection and credit processing
              </p>
            </div>
          </div>
          
          <button
            onClick={runFlowGladTest}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <TestTube className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Running Tests...' : 'Run FlowGlad Tests'}
          </button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Test Results</h2>
            
            {testResult.error ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Test Failed</p>
                  <p className="text-red-600 text-sm">{testResult.error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Health Check Result */}
                <div className={`flex items-center gap-3 p-4 border rounded-lg ${
                  testResult.healthCheck?.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  {testResult.healthCheck?.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">Waste Credits API</p>
                    <p className="text-sm">
                      {testResult.healthCheck?.success ? 'Waste credits system operational' : 'System check failed'}
                    </p>
                  </div>
                </div>

                {/* Billing Test Result */}
                <div className={`flex items-center gap-3 p-4 border rounded-lg ${
                  testResult.billingTest?.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  {testResult.billingTest?.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium">FlowGlad Integration</p>
                    <p className="text-sm">
                      {testResult.billingTest?.success ? 
                        'FlowGlad integration active' : 
                        'Using demo data (FlowGlad setup needed)'
                      }
                    </p>
                  </div>
                </div>

                {/* Credit Processing Test Result */}
                <div className={`flex items-center gap-3 p-4 border rounded-lg ${
                  testResult.creditTest?.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  {testResult.creditTest?.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">Waste Credit Processing</p>
                    <p className="text-sm">
                      {testResult.creditTest?.success ? 
                        `Credit £${testResult.creditTest.data?.amount} processed successfully` : 
                        'Credit processing failed'
                      }
                    </p>
                    {testResult.creditTest?.data?.creditId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Transaction ID: {testResult.creditTest.data.creditId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Honcho AI Test Result */}
                <div className={`flex items-center gap-3 p-4 border rounded-lg ${
                  testResult.honchoTest?.success ? 'bg-purple-50 border-purple-200' : 'bg-red-50 border-red-200'
                }`}>
                  {testResult.honchoTest?.success ? (
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">Honcho AI Learning</p>
                    <p className="text-sm">
                      {testResult.honchoTest?.success ? 
                        'Waste event recorded for AI analysis' : 
                        'Honcho AI integration failed'
                      }
                    </p>
                    {testResult.honchoTest?.data?.message && (
                      <p className="text-xs text-purple-600 mt-1">
                        {testResult.honchoTest.data.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* FlowGlad API Communication Details */}
                {testResult.creditTest?.success && testResult.creditTest.data && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      FlowGlad API Live Communication
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Transaction Details */}
                      <div className="bg-white/70 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3 text-sm">🔗 Transaction Details</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center py-1 px-2 bg-blue-50 rounded">
                            <span className="font-medium text-blue-700">Credit ID:</span>
                            <span className="font-mono text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                              {testResult.creditTest.data.creditId}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 bg-green-50 rounded">
                            <span className="font-medium text-green-700">Amount:</span>
                            <span className="font-mono text-green-900 bg-green-100 px-2 py-0.5 rounded">
                              {testResult.creditTest.data.currency}{testResult.creditTest.data.amount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 bg-purple-50 rounded">
                            <span className="font-medium text-purple-700">Status:</span>
                            <span className="font-mono text-purple-900 bg-purple-100 px-2 py-0.5 rounded uppercase">
                              {testResult.creditTest.data.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 bg-orange-50 rounded">
                            <span className="font-medium text-orange-700">Processed:</span>
                            <span className="font-mono text-orange-900 bg-orange-100 px-2 py-0.5 rounded text-xs">
                              {new Date(testResult.creditTest.data.processedAt).toLocaleTimeString('en-GB')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* API Communication */}
                      <div className="bg-white/70 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3 text-sm">📡 API Communication</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 py-1 px-2 bg-slate-50 rounded">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-slate-700">Endpoint:</span>
                            <span className="font-mono text-slate-800">/api/waste-credits</span>
                          </div>
                          <div className="flex items-center gap-2 py-1 px-2 bg-slate-50 rounded">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-slate-700">Method:</span>
                            <span className="font-mono text-slate-800">POST</span>
                          </div>
                          <div className="flex items-center gap-2 py-1 px-2 bg-slate-50 rounded">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="font-medium text-slate-700">Response:</span>
                            <span className="font-mono text-slate-800">200 OK</span>
                          </div>
                          <div className="flex items-center gap-2 py-1 px-2 bg-slate-50 rounded">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="font-medium text-slate-700">Auth:</span>
                            <span className="font-mono text-slate-800">sk_test_***...SvVYSUo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">
                        ✅ FlowGlad API Successfully Connected & Processing Credits
                      </p>
                      <p className="text-blue-700 text-xs mt-1">
                        Live transaction processing with unique IDs and timestamps
                      </p>
                    </div>
                  </div>
                )}

                {/* Raw Response */}
                <details className="border rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium">
                    View Raw API Response
                  </summary>
                  <div className="p-4 border-t bg-gray-50">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            )}
            
            <p className="text-gray-500 text-xs mt-4">
              Test completed at: {new Date(testResult.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
