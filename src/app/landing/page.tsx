'use client';

import Link from 'next/link';
import { ArrowRight, ChefHat } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-8">
        {/* Wagamama Food Image */}
        <div className="mb-12">
        <div className="text-4xl font-bold text-red-600 mb-8">WagaWaste/Watch</div>
          <img 
            src="https://images.ctfassets.net/1aemqu6a6t65/33y5YLDlHtFCFkNTxH8oEA/634bc08b8d7d5bb8e31a3dcc2d404629/Wagamama2022October-1827-edited_95B3E6BF-E923-456D-9FB3D7C7F7363925_38c3b269-8bf4-4f0f-bb1e7da34083ae2f.jpg?q=72&w=1200&h=630&fit=fill"
            alt="Wagamama Asian Food"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>

        {/* Simple Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all shadow-2xl text-2xl font-bold group"
        >
          <ChefHat className="w-8 h-8" />
          Enter Kitchen Dashboard
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
