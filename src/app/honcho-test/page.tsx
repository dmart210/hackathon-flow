'use client';

import { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HonchoTestPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [recordingEvent, setRecordingEvent] = useState(false);
  const [newInsightAnimation, setNewInsightAnimation] = useState<string | null>(null);

  useEffect(() => {
    testHonchoIntegration();
  }, []);

  const testHonchoIntegration = async () => {
    try {
      // Test the Honcho API integration
      const response = await fetch('/api/honcho');
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights);
        setApiKeyStatus('valid');
      } else {
        setApiKeyStatus('invalid');
      }
    } catch (error) {
      console.error('Honcho integration test failed:', error);
      setApiKeyStatus('invalid');
    } finally {
      setLoading(false);
    }
  };

  const recordTestWasteEvent = async () => {
    setRecordingEvent(true);
    
    // Generate random test data for more variety
    const testItems = ['Ramen Bowl', 'Chicken Katsu', 'Pad Thai', 'Miso Soup', 'Gyoza', 'Beef Teriyaki'];
    const testReasons = ['Overcooked during rush', 'Customer returned meal', 'Dropped during service', 'Past expiry time', 'Wrong order prepared', 'Quality control failure'];
    const testLocations = ['Main Kitchen', 'Prep Station', 'Service Counter', 'Storage Area', 'Grill Station'];
    
    const randomItem = testItems[Math.floor(Math.random() * testItems.length)];
    const randomReason = testReasons[Math.floor(Math.random() * testReasons.length)];
    const randomLocation = testLocations[Math.floor(Math.random() * testLocations.length)];
    const randomCost = (Math.random() * 15 + 3).toFixed(2); // Between £3-£18
    const randomQuantity = Math.floor(Math.random() * 3) + 1; // 1-3 units

    try {
      // 1. Record the waste event with Honcho
      const honchoResponse = await fetch('/api/honcho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_waste',
          itemName: randomItem,
          quantity: randomQuantity,
          reason: randomReason,
          cost: parseFloat(randomCost),
          location: randomLocation
        })
      });

      const honchoResult = await honchoResponse.json();
      console.log('Waste event recorded:', honchoResult);
      
      // 2. Automatically create FlowGlad credit for the waste
      const creditResponse = await fetch('/api/waste-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: randomItem,
          quantity: randomQuantity,
          cost: parseFloat(randomCost),
          location: randomLocation,
          reason: randomReason,
          description: `Auto-credit for ${randomItem} waste incident`,
          currency: 'USD'
        })
      });

      const creditResult = await creditResponse.json();
      console.log('FlowGlad credit created:', creditResult);
      
      if (honchoResult.success && honchoResult.newInsight) {
        // Add the new insight to the beginning of the array with animation
        setInsights(prevInsights => [honchoResult.newInsight, ...prevInsights.slice(0, 5)]); // Keep only 6 insights max
        setNewInsightAnimation(honchoResult.newInsight.id);
        
        // Remove animation after 2 seconds
        setTimeout(() => {
          setNewInsightAnimation(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to record waste event:', error);
    } finally {
      setRecordingEvent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-purple-100">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-purple-600 hover:text-purple-800 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Honcho AI Integration Test
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Real-time AI insights powered by your API key
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              apiKeyStatus === 'valid' ? 'bg-green-100 text-green-800' : 
              apiKeyStatus === 'invalid' ? 'bg-red-100 text-red-800' : 
              'bg-gray-100 text-gray-600'
            }`}>
              <div className="flex items-center gap-2">
                {apiKeyStatus === 'valid' && <CheckCircle className="w-5 h-5" />}
                {apiKeyStatus === 'checking' && <Brain className="w-5 h-5 animate-pulse" />}
                {apiKeyStatus === 'invalid' && <Zap className="w-5 h-5" />}
                <span className="font-medium">
                  {apiKeyStatus === 'valid' ? 'API Connected' : 
                   apiKeyStatus === 'invalid' ? 'API Error' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-500" />
            Honcho API Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">API Key Status</h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <div className="text-gray-600">Key: hch-v2-kde1e846k01sat0dv...f031hifj2quxl4a61</div>
                <div className={`mt-2 font-semibold ${
                  apiKeyStatus === 'valid' ? 'text-green-600' : 
                  apiKeyStatus === 'invalid' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  Status: {apiKeyStatus === 'valid' ? '✅ ACTIVE' : 
                          apiKeyStatus === 'invalid' ? '❌ ERROR' : 
                          '🔄 CHECKING'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Integration Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Real waste data analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  AI-powered pattern detection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Operational efficiency insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Cost optimization recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-blue-500" />
              AI-Generated Insights
            </h2>
            <button
              onClick={recordTestWasteEvent}
              disabled={recordingEvent}
              className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 ${
                recordingEvent 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              }`}
            >
              {recordingEvent ? (
                <>
                  <Brain className="w-5 h-5 animate-spin" />
                  Generating AI Insight...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Record Test Event
                </>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Brain className="w-8 h-8 text-purple-500 animate-pulse mr-3" />
              <span className="text-gray-600">Analyzing waste patterns with Honcho AI...</span>
            </div>
          ) : insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <div key={insight?.id || index} className={`p-6 rounded-lg border-l-4 transition-all duration-500 ${
                  insight?.type === 'pattern_detection' ? 'bg-blue-50 border-blue-500' :
                  insight?.type === 'cost_optimization' ? 'bg-green-50 border-green-500' :
                  'bg-purple-50 border-purple-500'
                } ${
                  newInsightAnimation === insight?.id ? 'ring-4 ring-yellow-300 ring-opacity-50 scale-105 shadow-xl' : ''
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight?.type === 'pattern_detection' ? 'bg-blue-100' :
                      insight?.type === 'cost_optimization' ? 'bg-green-100' :
                      'bg-purple-100'
                    } ${
                      newInsightAnimation === insight?.id ? 'animate-pulse' : ''
                    }`}>
                      {insight?.type === 'pattern_detection' ? <TrendingUp className="w-5 h-5 text-blue-600" /> :
                       insight?.type === 'cost_optimization' ? <Zap className="w-5 h-5 text-green-600" /> :
                       <Brain className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {insight?.type ? insight.type.replace('_', ' ') : 'General Insight'}
                        </h3>
                        {newInsightAnimation === insight?.id && (
                          <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full animate-bounce">
                            NEW!
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {insight?.message || 'No insight message available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            (insight?.confidence || 0) > 0.9 ? 'bg-green-500' :
                            (insight?.confidence || 0) > 0.8 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <span className="text-xs text-gray-500">
                            {((insight?.confidence || 0) * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                        {insight?.timestamp && (
                          <span className="text-xs text-gray-400">
                            {new Date(insight.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No AI insights available yet. Try recording a test waste event.</p>
            </div>
          )}
        </div>

        {/* Real-time Data Integration */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🎯 Hackathon Demo Ready!</h2>
          <p className="text-lg mb-6 text-purple-100">
            Honcho AI is now analyzing your real waste management data
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">Real-time</div>
              <div className="text-sm">Waste Pattern Analysis</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">AI-Powered</div>
              <div className="text-sm">Operational Insights</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">Live Data</div>
              <div className="text-sm">PostgreSQL Integration</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/trends" 
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              View Data Trends
            </Link>
            <Link 
              href="/why-us" 
              className="bg-purple-600/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-purple-600/30 transition-colors"
            >
              Why Choose Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
