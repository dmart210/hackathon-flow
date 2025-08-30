// Global in-memory store for credits (in production, this would be a database)
interface StoredCredit {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description: string;
  metadata?: any;
}

class CreditsStore {
  private static instance: CreditsStore;
  private credits: StoredCredit[] = [];

  static getInstance(): CreditsStore {
    if (!CreditsStore.instance) {
      CreditsStore.instance = new CreditsStore();
      // Initialize with some sample data
      CreditsStore.instance.initializeSampleData();
    }
    return CreditsStore.instance;
  }

  private initializeSampleData() {
    this.credits = [
      {
        id: 'cred_sample_1',
        amount: 3060, // $30.60 in cents (converted from £24.50)
        currency: 'USD',
        status: 'completed',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Waste credit for overcooked ramen batch - automatic refund',
        metadata: {
          wasteType: 'food',
          wasteAmount: 5,
          location: 'Main Kitchen',
          source: 'Automatic Waste Logger',
          originalCostGBP: 2450
        }
      },
      {
        id: 'cred_sample_2',
        amount: 2310, // $23.10 in cents (converted from £18.50)
        currency: 'USD',
        status: 'completed',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        description: 'Food waste compensation - customer return',
        metadata: {
          wasteType: 'food',
          wasteAmount: 3,
          location: 'Service Counter',
          source: 'POS System',
          originalCostGBP: 1850
        }
      }
    ];
  }

  addCredit(credit: StoredCredit): void {
    this.credits.unshift(credit); // Add to beginning
    // Keep only last 50 credits
    if (this.credits.length > 50) {
      this.credits = this.credits.slice(0, 50);
    }
  }

  getCredits(): StoredCredit[] {
    return [...this.credits]; // Return copy
  }

  getCreditsSummary() {
    const totalCredits = this.credits.length;
    const totalAmount = this.credits.reduce((sum, credit) => sum + credit.amount, 0);
    
    // Calculate this month vs last month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonthCredits = this.credits.filter(credit => {
      const creditDate = new Date(credit.created_at);
      return creditDate.getMonth() === currentMonth && creditDate.getFullYear() === currentYear;
    });
    
    const lastMonthCredits = this.credits.filter(credit => {
      const creditDate = new Date(credit.created_at);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return creditDate.getMonth() === lastMonth && creditDate.getFullYear() === lastMonthYear;
    });
    
    const thisMonth = thisMonthCredits.reduce((sum, credit) => sum + credit.amount, 0);
    const lastMonth = lastMonthCredits.reduce((sum, credit) => sum + credit.amount, 0);

    return {
      totalCredits,
      totalAmount,
      currency: 'USD',
      thisMonth,
      lastMonth
    };
  }
}

export const creditsStore = CreditsStore.getInstance();
