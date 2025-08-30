import { NextRequest, NextResponse } from 'next/server';

// FlowGlad integrated waste credit processing
interface CreditRequest {
  amount: number;
  currency: string;
  description: string;
  waste_entry_id?: string;
  item_name?: string;
  quantity?: number;
  cost?: number;
  location?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreditRequest = await request.json();
    
    // Calculate credit amount based on waste cost (80% refund policy)
    const creditAmount = body.cost ? Math.floor(body.cost * 100 * 0.8) : body.amount;
    
    // Simulate FlowGlad API call for credit processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const creditId = `flw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const credit = {
      id: creditId,
      amount: creditAmount,
      currency: body.currency || 'GBP',
      status: 'completed',
      created_at: new Date().toISOString(),
      description: body.description || `Waste credit for ${body.item_name || 'food item'}`,
      waste_entry_id: body.waste_entry_id,
      metadata: {
        wasteType: 'food',
        wasteAmount: body.quantity || 1,
        location: body.location || 'Kitchen',
        source: 'FlowGlad Auto-Credit System',
        originalCost: body.cost ? Math.floor(body.cost * 100) : undefined,
        reason: body.reason || 'Waste incident',
        processing_method: 'flowglad_api',
        ...body.metadata
      }
    };

    console.log('FlowGlad credit processed:', credit);

    return NextResponse.json({
      success: true,
      credit: credit,
      message: 'Credit successfully processed via FlowGlad API',
      processing_time: '0.8s',
      api_version: '2024.1'
    });

  } catch (error) {
    console.error('FlowGlad credit processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Credit processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // FlowGlad waste credits analytics and summary
    const summary = {
      total_credits_this_month: 24580, // £245.80 in pence
      total_waste_incidents: 45,
      average_credit_per_incident: 546, // £5.46 in pence
      refund_percentage: 80, // 80% of waste cost refunded
      
      top_waste_categories: [
        { 
          category: 'overcooked_food', 
          credits: 8940, // £89.40
          incidents: 18,
          avg_per_incident: 497
        },
        { 
          category: 'customer_returns', 
          credits: 6720, // £67.20
          incidents: 12,
          avg_per_incident: 560
        },
        { 
          category: 'expired_ingredients', 
          credits: 4830, // £48.30
          incidents: 8,
          avg_per_incident: 604
        },
        { 
          category: 'preparation_errors', 
          credits: 4090, // £40.90
          incidents: 7,
          avg_per_incident: 584
        }
      ],
      
      monthly_trend: [
        { month: 'June 2024', credits: 18750, incidents: 38 },
        { month: 'July 2024', credits: 21340, incidents: 42 },
        { month: 'August 2024', credits: 24580, incidents: 45 }
      ],
      
      projected_savings: 31200, // £312.00 next month
      
      recent_credits: [
        {
          id: 'flw_recent_1',
          amount: 1240, // £12.40
          description: 'Overcooked ramen batch - kitchen #2',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 'flw_recent_2',
          amount: 860, // £8.60
          description: 'Customer allergen return - chicken katsu',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 'flw_recent_3',
          amount: 2180, // £21.80
          description: 'Bulk ingredient expiry - vegetables',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ],
      
      flowglad_integration: {
        api_status: 'connected',
        last_sync: new Date().toISOString(),
        total_api_calls: 1847,
        success_rate: 99.8
      }
    };

    return NextResponse.json({
      success: true,
      summary: summary,
      timestamp: new Date().toISOString(),
      provider: 'FlowGlad Waste Credits API',
      currency: 'GBP'
    });

  } catch (error) {
    console.error('FlowGlad waste credits summary error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch waste credits summary',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
