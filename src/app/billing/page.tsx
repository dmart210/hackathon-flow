import { BillingPage } from '@flowglad/nextjs';

export default function Billing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Wagamama Billing & Credits</h1>
          <p className="text-gray-600 mb-6">
            View and manage your FlowGlad credits from waste management automation.
          </p>
        </div>
        
        <BillingPage />
      </div>
    </div>
  );
}
