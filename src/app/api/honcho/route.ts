import { NextRequest, NextResponse } from 'next/server';
import { honchoWasteAI } from '@/lib/honcho';

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    
    switch (action) {
      case 'record_waste':
        await honchoWasteAI.recordWasteEvent(data);
        return NextResponse.json({ 
          success: true, 
          message: 'Waste event recorded with Honcho AI' 
        });
        
      case 'get_insights':
        const insights = await honchoWasteAI.getWasteInsights();
        return NextResponse.json({ 
          success: true, 
          insights 
        });
        
      case 'get_specific_insight':
        const insight = await honchoWasteAI.getWasteInsights();
        return NextResponse.json({ 
          success: true, 
          insight: insight[0] || null
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Honcho API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Honcho API error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const insights = await honchoWasteAI.getWasteInsights();
    return NextResponse.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get Honcho insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
