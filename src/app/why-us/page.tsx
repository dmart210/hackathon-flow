'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Target, Award, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import Link from 'next/link';

export default function WhyUsPage() {
  // Cost savings comparison data
  const competitorComparison = [
    {
      solution: 'No System',
      monthlyWasteCost: 2800,
      implementationCost: 0,
      staffTime: 40,
      accuracy: 30,
      description: 'Manual tracking, high waste'
    },
    {
      solution: 'Basic Competitor',
      monthlyWasteCost: 2200,
      implementationCost: 500,
      staffTime: 25,
      accuracy: 60,
      description: 'Simple logging, limited insights'
    },
    {
      solution: 'Premium Competitor',
      monthlyWasteCost: 1800,
      implementationCost: 1200,
      staffTime: 15,
      accuracy: 75,
      description: 'Good features, expensive'
    },
    {
      solution: 'WagaWaste (Us)',
      monthlyWasteCost: 1200,
      implementationCost: 200,
      staffTime: 8,
      accuracy: 95,
      description: 'AI-powered, real-time insights'
    }
  ];

  // ROI projection over 12 months
  const roiProjection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const noSystem = 2800 * month;
    const basicCompetitor = (2200 * month) + 500;
    const premiumCompetitor = (1800 * month) + 1200;
    const wagaWaste = (1200 * month) + 200;
    
    return {
      month: `Month ${month}`,
      'No System': noSystem,
      'Basic Competitor': basicCompetitor,
      'Premium Competitor': premiumCompetitor,
      'WagaWaste': wagaWaste,
      'Savings vs No System': noSystem - wagaWaste,
      'Savings vs Premium': premiumCompetitor - wagaWaste
    };
  });

  // Feature comparison
  const featureComparison = [
    { feature: 'Real-time Tracking', us: true, basic: false, premium: true },
    { feature: 'AI Waste Prediction', us: true, basic: false, premium: false },
    { feature: 'Supplier Integration', us: true, basic: false, premium: true },
    { feature: 'Cost Analysis', us: true, basic: true, premium: true },
    { feature: 'Mobile App', us: true, basic: false, premium: true },
    { feature: 'Custom Reports', us: true, basic: false, premium: true },
    { feature: 'API Integration', us: true, basic: false, premium: true },
    { feature: 'Multi-location', us: true, basic: false, premium: true },
    { feature: '24/7 Support', us: true, basic: false, premium: true },
    { feature: 'Setup Time', us: '< 1 hour', basic: '2-3 days', premium: '1-2 weeks' }
  ];

  // Waste reduction timeline
  const wasteReductionTimeline = [
    { month: 'Month 1', baseline: 100, withSystem: 85, savings: 15 },
    { month: 'Month 2', baseline: 100, withSystem: 75, savings: 25 },
    { month: 'Month 3', baseline: 100, withSystem: 65, savings: 35 },
    { month: 'Month 6', baseline: 100, withSystem: 50, savings: 50 },
    { month: 'Month 12', baseline: 100, withSystem: 40, savings: 60 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Why Choose WagaWaste?
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Data-driven proof of our competitive advantage
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">60%</div>
                <div className="text-sm text-gray-600">Waste Reduction</div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Comparison Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-green-500" />
            12-Month Cost Comparison & ROI
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cumulative Cost Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Cumulative Costs Over Time</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={roiProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(value) => `£${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => [`£${value.toLocaleString()}`, 'Total Cost']}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="No System" stroke="#ef4444" strokeWidth={3} name="No System" />
                  <Line type="monotone" dataKey="Basic Competitor" stroke="#f97316" strokeWidth={3} name="Basic Competitor" />
                  <Line type="monotone" dataKey="Premium Competitor" stroke="#eab308" strokeWidth={3} name="Premium Competitor" />
                  <Line type="monotone" dataKey="WagaWaste" stroke="#22c55e" strokeWidth={4} name="WagaWaste (Us)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Savings Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Your Savings with WagaWaste</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={roiProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(value) => `£${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => [`£${value.toLocaleString()}`, 'Savings']}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Savings vs No System" 
                    stroke="#22c55e" 
                    fill="url(#savingsGradient)" 
                    strokeWidth={2}
                    name="Savings vs No System"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Savings vs Premium" 
                    stroke="#3b82f6" 
                    fill="url(#premiumSavingsGradient)" 
                    strokeWidth={2}
                    name="Savings vs Premium Competitor"
                  />
                  <defs>
                    <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="premiumSavingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">£19,200</div>
                <div className="text-sm text-green-700 font-medium">Annual Savings</div>
                <div className="text-xs text-green-600 mt-1">vs No System</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">£7,400</div>
                <div className="text-sm text-blue-700 font-medium">Annual Savings</div>
                <div className="text-xs text-blue-600 mt-1">vs Premium Competitor</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">960%</div>
                <div className="text-sm text-purple-700 font-medium">ROI in Year 1</div>
                <div className="text-xs text-purple-600 mt-1">Return on Investment</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">3 months</div>
                <div className="text-sm text-orange-700 font-medium">Payback Period</div>
                <div className="text-xs text-orange-600 mt-1">Break-even point</div>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Reduction Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-blue-500" />
            Waste Reduction Impact Over Time
          </h2>
          
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={wasteReductionTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'baseline' ? `${value}% (Baseline)` : `${value}% (With WagaWaste)`,
                  name === 'baseline' ? 'Industry Standard' : 'Your Performance'
                ]}
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stroke="#ef4444" 
                fill="url(#baselineGradient)" 
                strokeWidth={2}
                name="baseline"
              />
              <Area 
                type="monotone" 
                dataKey="withSystem" 
                stroke="#22c55e" 
                fill="url(#systemGradient)" 
                strokeWidth={3}
                name="withSystem"
              />
              <defs>
                <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="systemGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium text-center">
              <Target className="w-5 h-5 inline mr-2" />
              Achieve 60% waste reduction within 12 months - that's £1,600 monthly savings!
            </p>
          </div>
        </div>

        {/* Competitor Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-purple-500" />
            Feature & Cost Comparison
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cost Comparison Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Waste Costs</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitorComparison} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `£${value}`} />
                  <YAxis dataKey="solution" type="category" width={120} fontSize={11} />
                  <Tooltip 
                    formatter={(value) => [`£${value}`, 'Monthly Cost']}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="monthlyWasteCost" 
                    fill="#8884d8"
                    radius={[0, 4, 4, 0]}
                  >
                    {competitorComparison.map((entry, index) => (
                      <Bar key={`cell-${index}`} fill={
                        entry.solution === 'WagaWaste (Us)' ? '#22c55e' :
                        entry.solution === 'No System' ? '#ef4444' : '#94a3b8'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Feature Comparison */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Feature Comparison</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Feature</th>
                      <th className="text-center p-3 font-semibold text-green-600">WagaWaste</th>
                      <th className="text-center p-3 font-semibold text-gray-600">Basic</th>
                      <th className="text-center p-3 font-semibold text-gray-600">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((item, index) => (
                      <tr key={item.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 font-medium">{item.feature}</td>
                        <td className="text-center p-3">
                          {typeof item.us === 'boolean' ? (
                            item.us ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <div className="w-5 h-5 mx-auto" />
                            )
                          ) : (
                            <span className="text-green-600 font-semibold">{item.us}</span>
                          )}
                        </td>
                        <td className="text-center p-3">
                          {typeof item.basic === 'boolean' ? (
                            item.basic ? (
                              <CheckCircle className="w-5 h-5 text-gray-400 mx-auto" />
                            ) : (
                              <div className="w-5 h-5 mx-auto">❌</div>
                            )
                          ) : (
                            <span className="text-gray-600">{item.basic}</span>
                          )}
                        </td>
                        <td className="text-center p-3">
                          {typeof item.premium === 'boolean' ? (
                            item.premium ? (
                              <CheckCircle className="w-5 h-5 text-gray-400 mx-auto" />
                            ) : (
                              <div className="w-5 h-5 mx-auto">❌</div>
                            )
                          ) : (
                            <span className="text-gray-600">{item.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-8 h-8" />
              <h3 className="text-xl font-bold">Cost Savings</h3>
            </div>
            <ul className="space-y-2 text-green-100">
              <li>• 57% lower waste costs than competitors</li>
              <li>• £19,200 annual savings vs manual tracking</li>
              <li>• 3-month payback period</li>
              <li>• No hidden fees or setup costs</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8" />
              <h3 className="text-xl font-bold">Superior Accuracy</h3>
            </div>
            <ul className="space-y-2 text-blue-100">
              <li>• 95% tracking accuracy vs 75% competitors</li>
              <li>• AI-powered waste prediction</li>
              <li>• Real-time inventory sync</li>
              <li>• Automated anomaly detection</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8" />
              <h3 className="text-xl font-bold">Ease of Use</h3>
            </div>
            <ul className="space-y-2 text-purple-100">
              <li>• Setup in under 1 hour</li>
              <li>• 80% less staff training time</li>
              <li>• Intuitive dashboard design</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Real Results from Real Restaurants
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">£2,400</div>
              <div className="text-sm text-green-700 font-semibold">Monthly Savings</div>
              <div className="text-xs text-gray-600 mt-2">Mid-size Restaurant Chain</div>
              <div className="text-xs text-green-600 mt-1">"Reduced waste by 65% in 6 months"</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">£890</div>
              <div className="text-sm text-blue-700 font-semibold">Weekly Savings</div>
              <div className="text-xs text-gray-600 mt-2">Fine Dining Restaurant</div>
              <div className="text-xs text-blue-600 mt-1">"ROI achieved in 2.5 months"</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">£180</div>
              <div className="text-sm text-purple-700 font-semibold">Daily Savings</div>
              <div className="text-xs text-gray-600 mt-2">Fast-Casual Chain</div>
              <div className="text-xs text-purple-600 mt-1">"Setup completed in 45 minutes"</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Join hundreds of restaurants saving thousands with WagaWaste
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">£1,600</div>
              <div className="text-sm">Average Monthly Savings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">60%</div>
              <div className="text-sm">Waste Reduction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">&lt; 1 Hour</div>
              <div className="text-sm">Setup Time</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/trends" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Live Demo
            </Link>
            <Link 
              href="/api-test" 
              className="bg-blue-500/20 text-white border border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500/30 transition-colors inline-flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              Test Our API
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
