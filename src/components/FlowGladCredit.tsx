'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { flowGladService, FlowGladCreditResponse } from '@/lib/flowglad';
import { recordWasteWithHoncho } from '@/lib/data-simulator';

interface FlowGladCreditProps {
  wasteAmount?: number;
  wasteType?: string;
  autoTrigger?: boolean;
}

export function FlowGladCredit({ 
  wasteAmount = 15, 
  wasteType = 'noodles',
  autoTrigger = false 
}: FlowGladCreditProps) {
  const [creditResponse, setCreditResponse] = useState<FlowGladCreditResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCreditAmount = (waste: number): number => {
    // Calculate credit based on waste amount - £0.75 per unit wasted
    return Math.round(waste * 0.75);
  };

  const handleAutoCredit = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const creditAmount = calculateCreditAmount(wasteAmount);
      
      // Record waste event with Honcho AI for learning
      await recordWasteWithHoncho(wasteType, wasteAmount);
      
      const response = await flowGladService.issueCredit({
        amount: creditAmount,
        currency: '£',
        reason: `Automated refund for ${wasteType} waste (${wasteAmount} units)`,
        merchantId: 'wagamama_uk_001',
        metadata: {
          wasteType,
          wasteAmount,
          timestamp: new Date().toISOString(),
          source: 'waste_management_system'
        }
      });

      setCreditResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process credit');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-trigger credit when wasteAmount changes and autoTrigger is enabled
  useEffect(() => {
    if (autoTrigger && wasteAmount > 10 && !creditResponse && !isProcessing) {
      handleAutoCredit();
    }
  }, [wasteAmount, autoTrigger, creditResponse, isProcessing]);

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg shadow-lg border-2 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">FlowGlad Auto-Credit</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={handleAutoCredit}
          disabled={isProcessing}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Retry Credit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-lg border-2 border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">FlowGlad Auto-Credit</h3>
      </div>
      
      {!creditResponse ? (
        <div>
          <p className="text-green-700 mb-2">
            Waste detected: {wasteAmount} units of {wasteType}
          </p>
          <p className="text-green-600 text-sm mb-4">
            Estimated credit: £{calculateCreditAmount(wasteAmount)}
          </p>
          
          <button
            onClick={handleAutoCredit}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing Credit...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                {autoTrigger ? 'Auto-Credit Ready' : 'Trigger Credit'}
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">
                {creditResponse.currency}{creditResponse.amount} Credit Issued!
              </p>
              <p className="text-green-600 text-sm">
                Refund processed to Wagamama account
              </p>
            </div>
          </div>
          
          {/* FlowGlad API Communication Details */}
          <div className="bg-white/50 p-4 rounded border mb-3">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              FlowGlad API Response
            </h4>
            
            <div className="space-y-2 text-xs">
              {/* Transaction ID */}
              <div className="flex justify-between items-center py-1 px-2 bg-blue-50 rounded">
                <span className="font-medium text-blue-700">Transaction ID:</span>
                <span className="font-mono text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  {creditResponse.creditId}
                </span>
              </div>
              
              {/* Status */}
              <div className="flex justify-between items-center py-1 px-2 bg-green-50 rounded">
                <span className="font-medium text-green-700">Status:</span>
                <span className="font-mono text-green-800 bg-green-100 px-2 py-0.5 rounded uppercase">
                  {creditResponse.status}
                </span>
              </div>
              
              {/* Amount & Currency */}
              <div className="flex justify-between items-center py-1 px-2 bg-emerald-50 rounded">
                <span className="font-medium text-emerald-700">Amount:</span>
                <span className="font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {creditResponse.currency}{creditResponse.amount}
                </span>
              </div>
              
              {/* Processed Timestamp */}
              <div className="flex justify-between items-center py-1 px-2 bg-purple-50 rounded">
                <span className="font-medium text-purple-700">Processed At:</span>
                <span className="font-mono text-purple-800 bg-purple-100 px-2 py-0.5 rounded text-xs">
                  {new Date(creditResponse.processedAt).toLocaleTimeString('en-GB')}
                </span>
              </div>
            </div>
          </div>
          
          {/* API Endpoint Information */}
          <div className="bg-slate-50 p-3 rounded border">
            <h5 className="text-xs font-semibold text-slate-700 mb-2">🔗 FlowGlad Integration</h5>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>API: /api/waste-credits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Method: POST</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Response: 200 OK</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}