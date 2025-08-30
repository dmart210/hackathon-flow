import { honchoWasteAI, type WasteEvent } from './honcho';

export interface InventoryItem {
  ingredient: string;
  on_hand: number;
  waste_today: number;
  alert?: string;
  credit?: string;
}

export interface WasteDataPoint {
  time: string;
  noodles: number;
  broth: number;
  chicken: number;
}

export interface Alert {
  id: string;
  type: 'waste' | 'stockout' | 'credit';
  message: string;
  timestamp: string;
  action?: string;
}

export interface HonchoTip {
  message: string;
  confidence: number;
}

// Simulate inventory data
export const getInventoryData = (): InventoryItem[] => {
  const baseTime = Date.now();
  const timeVariation = Math.sin(baseTime / 10000) * 5; // Creates variation over time
  
  return [
    {
      ingredient: "Chicken Ramen Noodles",
      on_hand: Math.max(15, Math.floor(20 + timeVariation)),
      waste_today: Math.floor(3 + Math.random() * 4),
    },
    {
      ingredient: "Tonkotsu Broth",
      on_hand: Math.max(8, Math.floor(12 + timeVariation * 0.8)),
      waste_today: Math.floor(1 + Math.random() * 3),
    },
    {
      ingredient: "Grilled Chicken",
      on_hand: Math.max(25, Math.floor(30 + timeVariation * 1.2)),
      waste_today: Math.floor(2 + Math.random() * 5),
    },
    {
      ingredient: "Yaki Soba Noodles",
      on_hand: Math.max(10, Math.floor(18 + timeVariation * 0.6)),
      waste_today: Math.floor(1 + Math.random() * 3),
    }
  ];
};

// Simulate waste trend data
export const getWasteTrendData = (): WasteDataPoint[] => {
  const now = new Date();
  const data: WasteDataPoint[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Last 7 hours
    const hour = time.getHours();
    
    // Simulate higher waste during peak hours (12-2pm, 6-8pm)
    const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20);
    const baseWaste = isPeakHour ? 8 : 3;
    
    data.push({
      time: time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      noodles: baseWaste + Math.floor(Math.random() * 5),
      broth: Math.floor(baseWaste * 0.6) + Math.floor(Math.random() * 3),
      chicken: Math.floor(baseWaste * 0.8) + Math.floor(Math.random() * 4),
    });
  }
  
  return data;
};

// Simulate alerts
export const getAlerts = (): Alert[] => {
  const alerts: Alert[] = [];
  const now = new Date();
  
  // High waste alert
  if (Math.random() > 0.7) {
    alerts.push({
      id: 'waste-1',
      type: 'waste',
      message: 'High noodle waste detected!',
      timestamp: now.toLocaleTimeString('en-GB'),
      action: '£15 refunded via FlowGlad'
    });
  }
  
  // Stockout warning
  if (Math.random() > 0.8) {
    alerts.push({
      id: 'stock-1',
      type: 'stockout',
      message: 'Tonkotsu broth running low - stockout in 1 hour!',
      timestamp: new Date(now.getTime() - 10 * 60 * 1000).toLocaleTimeString('en-GB'),
    });
  }
  
  return alerts;
};

// Simulate Honcho memory tips
export const getHonchoTip = (): HonchoTip => {
  const tips = [
    "Last Tuesday noodle waste was high — reduce prep tonight",
    "Broth waste typically spikes at 7pm — adjust portions",
    "Chicken prep was perfect yesterday — maintain same portions",
    "Weekend waste is 30% higher — consider smaller batch sizes"
  ];
  
  return {
    message: tips[Math.floor(Math.random() * tips.length)],
    confidence: 85 + Math.floor(Math.random() * 10)
  };
};

// Record waste events with Honcho AI for learning
export const recordWasteWithHoncho = async (ingredient: string, amount: number) => {
  try {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    let shift: 'morning' | 'lunch' | 'evening' = 'morning';
    if (hour >= 11 && hour < 15) shift = 'lunch';
    else if (hour >= 15) shift = 'evening';
    
    await honchoWasteAI.recordWasteEvent({
      id: `waste_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now.toISOString(),
      category: ingredient,
      itemName: ingredient,
      quantity: amount,
      unit: 'units',
      reason: 'overproduction',
      location: 'main_kitchen',
      cost: amount * 0.75,
      carbonFootprint: amount * 1.2
    });
    
    console.log(`Recorded waste event with Honcho: ${amount} units of ${ingredient}`);
  } catch (error) {
    console.error('Failed to record waste with Honcho:', error);
  }
};
