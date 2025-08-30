// Simple test to verify FlowGlad integration
import { flowGladService } from './src/lib/flowglad';

async function testFlowGlad() {
  console.log('🧪 Testing FlowGlad Integration...');
  
  try {
    const result = await flowGladService.issueCredit({
      amount: 15,
      currency: '£',
      reason: 'Test credit for noodle waste',
      merchantId: 'wagamama_uk_001',
      metadata: {
        wasteType: 'noodles',
        wasteAmount: 20,
        timestamp: new Date().toISOString(),
        source: 'test_script'
      }
    });
    
    console.log('✅ Credit Success:', result);
    console.log('💳 Transaction ID:', result.creditId);
    console.log('💰 Amount:', result.currency + result.amount);
    
  } catch (error) {
    console.log('❌ Credit Failed:', error);
  }
}

testFlowGlad();
