'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TestTube, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  data: any;
  error?: string;
}

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const BACKEND_URL = 'http://localhost:8080';

  // Test all backend API endpoints
  const runApiTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    const results: TestResult[] = [];

    // Test endpoints
    const endpoints = [
      { path: '/api/inventory', method: 'GET', description: 'Get all inventory items' },
      { path: '/api/waste', method: 'GET', description: 'Get all waste logs' },
      { path: '/api/suppliers', method: 'GET', description: 'Get all suppliers' },
      { path: '/', method: 'GET', description: 'Backend health check' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${BACKEND_URL}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        results.push({
          endpoint: endpoint.path,
          method: endpoint.method,
          status: response.status,
          success: response.ok,
          data: data
        });

      } catch (error) {
        results.push({
          endpoint: endpoint.path,
          method: endpoint.method,
          status: 0,
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setTestResults(results);
    setLoading(false);
    
    // Update backend status
    const healthResult = results.find(r => r.endpoint === '/');
    setBackendStatus(healthResult?.success ? 'online' : 'offline');
  };

  // Check backend status on load
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/`, { method: 'GET' });
        setBackendStatus(response.ok ? 'online' : 'offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    
    checkBackendStatus();
  }, []);

  // Test POST endpoints
  const testPostEndpoints = async () => {
    const postTests = [
      {
        endpoint: '/api/inventory',
        data: {
          name: 'Test Ramen Noodles',
          on_hand: 50,
          cost_per_unit: 2.5,
          supplier_id: null
        }
      },
      {
        endpoint: '/api/suppliers',
        data: {
          name: 'Test Supplier Co.',
          contact_info: 'test@supplier.com'
        }
      }
    ];

    for (const test of postTests) {
      try {
        const response = await fetch(`${BACKEND_URL}${test.endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(test.data)
        });

        const data = await response.json();
        
        setTestResults(prev => [...prev, {
          endpoint: test.endpoint,
          method: 'POST',
          status: response.status,
          success: response.ok,
          data: data
        }]);

      } catch (error) {
        setTestResults(prev => [...prev, {
          endpoint: test.endpoint,
          method: 'POST',
          status: 0,
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">API Integration Test</h1>
                <p className="text-gray-600">Test communication between frontend and backend</p>
              </div>
            </div>
            
            {/* Backend Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                backendStatus === 'online' ? 'bg-green-500' : 
                backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium">
                Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={runApiTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
              {loading ? 'Testing...' : 'Run GET Tests'}
            </button>
            
            <button
              onClick={testPostEndpoints}
              disabled={loading || backendStatus !== 'online'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              Test POST Endpoints
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Test Results</h2>
            
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {result.method} {result.endpoint}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      Status: {result.status}
                    </span>
                  </div>
                  
                  {result.error && (
                    <div className="mb-2 text-red-600 text-sm">
                      Error: {result.error}
                    </div>
                  )}
                  
                  <div className="bg-gray-100 rounded p-3 text-sm">
                    <strong>Response:</strong>
                    <pre className="mt-1 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Testing Instructions</h3>
          <div className="text-blue-800 space-y-2">
            <p>1. Make sure the backend server is running on port 8080</p>
            <p>2. Click "Run GET Tests" to test all read endpoints</p>
            <p>3. Click "Test POST Endpoints" to test data creation (only when backend is online)</p>
            <p>4. Check the console for detailed logs</p>
          </div>
        </div>

        {/* Backend Connection Info */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">Backend Connection</h3>
          <p className="text-gray-700">Backend URL: <code className="bg-gray-200 px-2 py-1 rounded">{BACKEND_URL}</code></p>
          <p className="text-gray-700 mt-2">Available Endpoints:</p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>GET/POST <code>/api/inventory</code> - Inventory management</li>
            <li>GET/POST <code>/api/waste</code> - Waste logging</li>
            <li>GET/POST <code>/api/suppliers</code> - Supplier management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}