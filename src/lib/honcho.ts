import { Honcho } from '@honcho-ai/sdk';

export interface WasteEvent {
  id: string;
  timestamp: string;
  category: string;
  itemName: string;
  quantity: number;
  unit: string;
  reason: string;
  location: string;
  cost: number;
  carbonFootprint: number;
  creditsEarned?: number;
}

export interface KitchenInsight {
  id: string;
  insight: string;
  confidence: number;
  category: 'reduction' | 'efficiency' | 'pattern' | 'trend';
  source: 'ai' | 'data' | 'simulation';
}

class HonchoWasteIntelligence {
  private client: Honcho | null = null;
  private kitchenSystem: any;
  private manager: any;
  private wasteSession: any;
  private useSimulation: boolean;
  private wasteHistory: WasteEvent[] = [];
  
  constructor() {
    this.useSimulation = process.env.HONCHO_USE_SIMULATION === 'true' || !process.env.HONCHO_API_KEY || process.env.HONCHO_API_KEY === 'demo_key_for_development';
    
    if (!this.useSimulation) {
      try {
        this.client = new Honcho({
          apiKey: process.env.HONCHO_API_KEY!
        });
        
        // Create peers - Kitchen System and Manager
        this.kitchenSystem = this.client.peer("wagamama_kitchen_system");
        this.manager = this.client.peer("kitchen_manager");
        
        // Create session for waste management
        this.wasteSession = this.client.session("waste_management_analysis");
        this.wasteSession.addPeers([this.kitchenSystem, this.manager]);
      } catch (error) {
        console.warn('Honcho SDK initialization failed, falling back to simulation:', error);
        this.useSimulation = true;
      }
    }
  }

  async recordWasteEvent(event: WasteEvent): Promise<void> {
    this.wasteHistory.push(event);
    
    if (!this.useSimulation && this.client && this.wasteSession) {
      try {
        await this.wasteSession.addMessage({
          role: "user",
          content: `Waste Event: ${event.itemName} (${event.quantity} ${event.unit}) - ${event.reason}. Cost: £${event.cost}, Location: ${event.location}`
        });
        
        // Get AI response for pattern analysis
        const response = await this.wasteSession.getResponse();
        console.log('Honcho Analysis:', response);
      } catch (error) {
        console.error('Error recording waste event to Honcho:', error);
      }
    } else {
      // Simulation mode - just log locally
      console.log('Simulated Honcho recording:', event);
    }
  }

  async getWasteInsights(): Promise<KitchenInsight[]> {
    if (!this.useSimulation && this.client && this.wasteSession) {
      try {
        // Get real AI insights from Honcho
        const response = await this.wasteSession.getResponse("Analyze current waste patterns and provide actionable insights");
        
        return [{
          id: `honcho_${Date.now()}`,
          insight: response.content || "AI analysis in progress...",
          confidence: 0.9,
          category: 'pattern',
          source: 'ai'
        }];
      } catch (error) {
        console.error('Error getting insights from Honcho:', error);
        // Fall back to simulation
      }
    }
    
    // Simulation mode - provide smart insights based on history
    const insights: KitchenInsight[] = [];
    
    if (this.wasteHistory.length > 0) {
      const recentWaste = this.wasteHistory.slice(-10);
      const categories = recentWaste.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
      
      if (topCategory) {
        insights.push({
          id: `sim_${Date.now()}_1`,
          insight: `${topCategory[0]} waste is your biggest concern with ${topCategory[1]} incidents recently. Consider portion control training.`,
          confidence: 0.85,
          category: 'pattern',
          source: 'simulation'
        });
      }
    }
    
    // Add generic insights for demo
    const simulatedInsights: KitchenInsight[] = [
      {
        id: `sim_${Date.now()}_2`,
        insight: "Peak waste occurs between 2-4 PM. Consider adjusting prep schedules to reduce overproduction.",
        confidence: 0.82,
        category: 'trend',
        source: 'simulation'
      },
      {
        id: `sim_${Date.now()}_3`,
        insight: "Vegetable prep waste could be reduced by 15% with better knife skills training.",
        confidence: 0.78,
        category: 'efficiency',
        source: 'simulation'
      },
      {
        id: `sim_${Date.now()}_4`,
        insight: "Implementing portion control for rice dishes could save £200/week in waste costs.",
        confidence: 0.90,
        category: 'reduction',
        source: 'simulation'
      }
    ];
    
    return [...insights, ...simulatedInsights.slice(0, 3)];
  }

  async getWasteAnalytics(): Promise<any> {
    if (!this.useSimulation && this.client) {
      try {
        // Get comprehensive analytics from Honcho
        const analytics = await this.wasteSession.getResponse("Provide detailed waste analytics including trends, costs, and recommendations");
        return JSON.parse(analytics.content || '{}');
      } catch (error) {
        console.error('Error getting analytics from Honcho:', error);
      }
    }
    
    // Simulation analytics
    const totalWaste = this.wasteHistory.reduce((sum, event) => sum + event.cost, 0);
    const totalCredits = this.wasteHistory.reduce((sum, event) => sum + (event.creditsEarned || 0), 0);
    
    return {
      totalWasteCost: totalWaste,
      totalCreditsEarned: totalCredits,
      wasteReduction: Math.random() * 20 + 10, // 10-30% reduction simulation
      efficiency: Math.random() * 15 + 75, // 75-90% efficiency
      recommendations: [
        "Focus on portion control during peak hours",
        "Implement better inventory rotation",
        "Train staff on proper food handling"
      ]
    };
  }

  getSimulationStatus(): { useSimulation: boolean; reason?: string } {
    if (this.useSimulation) {
      if (process.env.HONCHO_USE_SIMULATION === 'true') {
        return { useSimulation: true, reason: 'Simulation mode enabled via environment variable' };
      }
      if (!process.env.HONCHO_API_KEY || process.env.HONCHO_API_KEY === 'demo_key_for_development') {
        return { useSimulation: true, reason: 'No valid API key provided' };
      }
      return { useSimulation: true, reason: 'SDK initialization failed' };
    }
    return { useSimulation: false };
  }
}

// Create singleton instance
export const honchoWasteAI = new HonchoWasteIntelligence();
