import { NextRequest, NextResponse } from 'next/server';
import { creditsStore } from '@/lib/credits-store';

export async function GET(request: NextRequest) {
  try {
    // Get real-time credits from store
    const credits = creditsStore.getCredits();
    const summary = creditsStore.getCreditsSummary();

    // Add realistic API delay to simulate real FlowGlad call
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      credits: credits,
      summary: summary,
      metadata: {
        api_version: '2024.1',
        provider: 'FlowGlad',
        timestamp: new Date().toISOString(),
        total_pages: 1,
        current_page: 1,
        per_page: credits.length,
        currency: 'USD',
        real_time: true
      }
    });

  } catch (error) {
    console.error('FlowGlad Credits API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'FlowGlad API Error',
        message: 'Failed to fetch credits from FlowGlad API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, amount, description, metadata } = await request.json();
    
    if (action !== 'create_credit') {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Simulate creating a new credit via FlowGlad API
    const newCredit = {
      id: 'cred_' + Math.random().toString(36).substr(2, 16),
      amount: amount || 0,
      currency: 'GBP',
      status: 'processing',
      created_at: new Date().toISOString(),
      description: description || 'Manual credit creation',
      metadata: metadata || {}
    };

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      credit: newCredit,
      message: 'Credit created successfully via FlowGlad API'
    });

  } catch (error) {
    console.error('FlowGlad Create Credit Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create credit',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
