import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simulate FlowGlad billing API with comprehensive data
    const billingData = {
      currentUsage: {
        credits_used: 15420,
        credits_remaining: 4580,
        period_start: new Date(2024, 7, 1).toISOString(), // August 1, 2024
        period_end: new Date(2024, 7, 31).toISOString()   // August 31, 2024
      },
      subscription: {
        plan_name: 'Professional Waste Management',
        status: 'active',
        current_period_start: new Date(2024, 7, 1).toISOString(),
        current_period_end: new Date(2024, 8, 1).toISOString(),
        price: 12900, // £129.00 in pence
        currency: 'GBP'
      },
      invoices: [
        {
          id: 'inv_' + Math.random().toString(36).substr(2, 16),
          amount: 12900, // £129.00
          currency: 'GBP',
          status: 'paid',
          created_at: new Date(2024, 7, 1).toISOString(),
          due_date: new Date(2024, 7, 15).toISOString(),
          description: 'Monthly subscription - Professional Waste Management',
          invoice_url: 'https://flowglad.com/invoices/inv_example'
        },
        {
          id: 'inv_' + Math.random().toString(36).substr(2, 16),
          amount: 12900, // £129.00
          currency: 'GBP',
          status: 'paid',
          created_at: new Date(2024, 6, 1).toISOString(),
          due_date: new Date(2024, 6, 15).toISOString(),
          description: 'Monthly subscription - Professional Waste Management',
          invoice_url: 'https://flowglad.com/invoices/inv_example2'
        },
        {
          id: 'inv_' + Math.random().toString(36).substr(2, 16),
          amount: 8500, // £85.00 - additional credits
          currency: 'GBP',
          status: 'paid',
          created_at: new Date(2024, 6, 15).toISOString(),
          due_date: new Date(2024, 6, 30).toISOString(),
          description: 'Additional waste processing credits',
          invoice_url: 'https://flowglad.com/invoices/inv_example3'
        },
        {
          id: 'inv_' + Math.random().toString(36).substr(2, 16),
          amount: 12900,
          currency: 'GBP',
          status: 'pending',
          created_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
          description: 'Upcoming monthly subscription billing',
          invoice_url: null
        }
      ],
      paymentMethods: [
        {
          id: 'pm_' + Math.random().toString(36).substr(2, 16),
          type: 'card',
          last4: '4242',
          brand: 'visa',
          exp_month: 12,
          exp_year: 2026,
          is_default: true
        },
        {
          id: 'pm_' + Math.random().toString(36).substr(2, 16),
          type: 'card',
          last4: '0005',
          brand: 'mastercard',
          exp_month: 8,
          exp_year: 2025,
          is_default: false
        }
      ],
      usage_analytics: {
        daily_usage: [
          { date: '2024-08-25', credits: 520 },
          { date: '2024-08-26', credits: 680 },
          { date: '2024-08-27', credits: 440 },
          { date: '2024-08-28', credits: 750 },
          { date: '2024-08-29', credits: 620 },
          { date: '2024-08-30', credits: 580 }
        ],
        category_breakdown: {
          waste_processing: 8500,
          api_calls: 3200,
          storage: 2100,
          analytics: 1620
        },
        cost_savings: {
          this_month: 245000, // £2450.00 in pence
          last_month: 198000, // £1980.00 in pence
          year_to_date: 1876000 // £18760.00 in pence
        }
      }
    };

    // Add realistic API delay to simulate real FlowGlad call
    await new Promise(resolve => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      billing: billingData,
      metadata: {
        api_version: '2024.1',
        provider: 'FlowGlad Billing',
        timestamp: new Date().toISOString(),
        account_id: 'acct_wagamama_' + Math.random().toString(36).substr(2, 8),
        environment: process.env.NODE_ENV === 'production' ? 'live' : 'test'
      }
    });

  } catch (error) {
    console.error('FlowGlad Billing API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'FlowGlad Billing API Error',
        message: 'Failed to fetch billing data from FlowGlad',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, payment_method_id, subscription_plan } = await request.json();
    
    let result: any = {};
    
    switch (action) {
      case 'update_payment_method':
        result = {
          payment_method: {
            id: payment_method_id,
            updated: true,
            is_default: true
          }
        };
        break;
        
      case 'change_subscription':
        result = {
          subscription: {
            plan_name: subscription_plan,
            status: 'active',
            change_effective_date: new Date().toISOString()
          }
        };
        break;
        
      default:
        throw new Error('Invalid action specified');
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      ...result,
      message: `Successfully processed ${action}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('FlowGlad Billing Update Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Update failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
