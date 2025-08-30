'use client';

import { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp, Clock, Package } from 'lucide-react';
import { honchoWasteAI, type KitchenInsight } from '@/lib/honcho';

export function HonchoMemory() {
  const [insights, setInsights] = useState<KitchenInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTip, setCurrentTip] = useState<KitchenInsight | null>(null);

  useEffect(() => {
    const initializeHoncho = async () => {
      try {
        // Get AI insights from Honcho
        const wasteInsights = await honchoWasteAI.getWasteInsights();
        setInsights(wasteInsights);
        setCurrentTip(wasteInsights[0] || null);
      } catch (error) {
        console.error('Failed to initialize Honcho:', error);
        // Keep existing fallback behavior
        setInsights([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeHoncho();
  }, []);

  // Cycle through insights every 8 seconds for dynamic demo
  useEffect(() => {
    if (insights.length > 1) {
      const interval = setInterval(() => {
        setCurrentTip((prev: KitchenInsight | null) => {
          const currentIndex = insights.findIndex(tip => tip.id === prev?.id);
          const nextIndex = (currentIndex + 1) % insights.length;
          return insights[nextIndex];
        });
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [insights]);

  const getIcon = (category: string) => {
    switch (category) {
      case 'waste_pattern': return <TrendingUp className="w-4 h-4" />;
      case 'inventory': return <Package className="w-4 h-4" />;
      case 'timing': return <Clock className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg shadow-lg border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-900">Honcho AI Memory</h3>
        {currentTip && (
          <div className="ml-auto text-sm text-purple-600 font-medium">
            {Math.round(currentTip.confidence * 100)}% confidence
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="ml-3 text-purple-700">Analyzing waste patterns...</p>
        </div>
      ) : currentTip ? (
        <div>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-purple-800 font-medium">Smart Tip:</p>
              <p className="text-purple-700 mt-1">{currentTip.insight}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-purple-600">
              💡 Powered by Honcho AI pattern recognition
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-500">
              {getIcon(currentTip.category)}
              <span className="capitalize">{currentTip.category.replace('_', ' ')}</span>
            </div>
          </div>
          
          {insights.length > 1 && (
            <div className="mt-3 text-xs text-purple-500">
              Showing insight {insights.findIndex(tip => tip.id === currentTip.id) + 1} of {insights.length}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <p className="text-purple-600">Learning from your waste patterns...</p>
          <p className="text-purple-500 text-sm mt-1">Check back as more data is collected</p>
        </div>
      )}
    </div>
  );
}
