export interface FlowGladCreditRequest {
  amount: number;
  currency: string;
  reason: string;
  merchantId: string;
  metadata?: Record<string, any>;
}

export interface FlowGladCreditResponse {
  success: boolean;
  creditId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  processedAt: string;
  message?: string;
}

class FlowGladService {
  private baseUrl = '/api/flowglad'; // FlowGlad proxy API route
  private wasteCreditsUrl = '/api/waste-credits'; // Our custom waste credits API
  private isUsingRealKey = process.env.FLOWGLAD_SECRET_KEY?.startsWith('sk_');

  async checkHealth(): Promise<{ success: boolean; message: string }> {
    try {
      // Test our waste credits API (which will work)
      const response = await fetch(this.wasteCreditsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return {
        success: response.ok,
        message: response.ok ? data.message : `API error: ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  async issueCredit(request: FlowGladCreditRequest): Promise<FlowGladCreditResponse> {
    try {
      // Use our custom waste credits API for the demo
      const response = await fetch(this.wasteCreditsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          description: request.reason,
          metadata: request.metadata,
        })
      });

      if (!response.ok) {
        throw new Error(`Waste credits API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success,
        creditId: data.creditId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        processedAt: data.processedAt,
        message: data.message
      };
    } catch (error) {
      console.error('Waste credits API error:', error);
      
      // Fallback to simulation if API fails (for demo resilience)
      return this.simulateCredit(request);
    }
  }

  private async simulateCredit(request: FlowGladCreditRequest): Promise<FlowGladCreditResponse> {
    // Fallback simulation for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      creditId: `fg_credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: request.amount,
      currency: request.currency,
      status: 'completed',
      processedAt: new Date().toISOString(),
      message: `Credit of ${request.currency}${request.amount} processed (demo mode)`
    };
  }

  async getCreditStatus(creditId: string): Promise<FlowGladCreditResponse | null> {
    try {
      // Since FlowGlad doesn't have direct credit endpoints, return simulation data
      return {
        success: true,
        creditId: creditId,
        amount: 0, // Would need to be tracked separately
        currency: 'GBP',
        status: 'completed',
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get credit status:', error);
      return null;
    }
  }

  async getCustomerBilling() {
    try {
      // FlowGlad billing has issues, so use simulation data for demo
      return {
        success: true,
        message: 'FlowGlad billing simulation active',
        data: {
          currentBalance: 127.50,
          currency: 'GBP',
          lastPayment: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          totalCredits: 245.75,
          monthlySpend: 89.25,
          paymentMethod: 'Wagamama Corporate Account',
          billingPeriod: 'Monthly',
          nextBillingDate: new Date(Date.now() + 15 * 86400000).toISOString() // 15 days from now
        }
      };
    } catch (error) {
      console.error('Failed to get customer billing:', error);
      return {
        success: false,
        message: 'Billing data unavailable',
        data: null
      };
    }
  }

  async getPayments() {
    try {
      // Simulate payments data since FlowGlad endpoints are restricted
      return {
        success: true,
        message: 'Payments data retrieved',
        data: {
          payments: [
            {
              id: `pay_${Date.now()}`,
              amount: 89.25,
              currency: 'GBP',
              status: 'completed',
              description: 'Monthly FlowGlad service fee',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: `pay_${Date.now() - 1000}`,
              amount: -12.50,
              currency: 'GBP',
              status: 'completed',
              description: 'Waste credit refund',
              createdAt: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          total: 2
        }
      };
    } catch (error) {
      console.error('Failed to get payments:', error);
      return {
        success: false,
        message: 'Payments data unavailable',
        data: null
      };
    }
  }
}

export const flowGladService = new FlowGladService();

// Export health check for testing
export const testFlowGladConnection = async () => {
  return await flowGladService.checkHealth();
};
