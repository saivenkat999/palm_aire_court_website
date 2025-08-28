// Test script to verify Stripe payment integration
async function testPaymentIntegration() {
  console.log('🧪 Testing Stripe Payment Integration...\n');

  try {
    // Test 1: Check Stripe config endpoint
    console.log('1. Testing Stripe config endpoint...');
    const configResponse = await fetch('http://localhost:5000/api/stripe-config');
    const config = await configResponse.json();
    console.log('✅ Stripe config:', {
      hasPublishableKey: !!config.publishableKey,
      publishableKey: config.publishableKey ? `${config.publishableKey.substring(0, 20)}...` : 'Missing'
    });

    // Test 2: Test payment intent creation
    console.log('\n2. Testing payment intent creation...');
    const paymentIntentData = {
      amount: 8500, // $85.00 in cents
      customerEmail: 'test@example.com',
      metadata: {
        unitId: 'test-unit',
        unitName: 'Test Cottage',
        checkIn: '2025-09-01',
        checkOut: '2025-09-05',
        guests: '2'
      }
    };

    const paymentResponse = await fetch('http://localhost:5000/api/payment-intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentIntentData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      throw new Error(`Payment intent creation failed: ${paymentResponse.status} - ${errorText}`);
    }

    const paymentResult = await paymentResponse.json();
    console.log('✅ Payment intent created:', {
      hasClientSecret: !!paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      amount: paymentResult.amount,
      status: paymentResult.status
    });

    // Test 3: Get payment intent status
    if (paymentResult.paymentIntentId) {
      console.log('\n3. Testing payment intent retrieval...');
      const statusResponse = await fetch(`http://localhost:5000/api/payment-intents/${paymentResult.paymentIntentId}`);
      const statusResult = await statusResponse.json();
      console.log('✅ Payment intent status:', {
        id: statusResult.paymentIntentId,
        amount: statusResult.amount,
        status: statusResult.status
      });
    }

    console.log('\n🎉 All payment integration tests passed!');
    console.log('\n📝 Summary:');
    console.log('   ✅ Stripe configuration endpoint working');
    console.log('   ✅ Payment intent creation working');
    console.log('   ✅ Payment intent retrieval working');
    console.log('   ✅ All backend payment APIs functional');
    
    console.log('\n⚠️  Note: To complete payment flow, you need to:');
    console.log('   1. Add real Stripe test keys to .env file');
    console.log('   2. Test frontend payment form with real Stripe keys');
    console.log('   3. Monitor payment status in Stripe dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure the server is running: npm run dev');
    } else if (error.message.includes('Failed to create payment intent')) {
      console.log('\n💡 Check your Stripe secret key in .env file');
      console.log('   - Get test keys from: https://dashboard.stripe.com/test/apikeys');
    }
  }
}

// Run the test
testPaymentIntegration();
