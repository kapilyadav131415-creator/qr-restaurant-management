import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Check } from 'lucide-react';

interface SubscriptionPlan {
  spm_id: number;
  spm_name: string;
  spm_code: string;
  spm_price: string | number;
  spm_duration_days: number;
  spm_max_tables: number;
  spm_max_branches: number;
  spm_max_users: number;
  spm_features: string[] | string | any;
  spm_is_trial: boolean;
}

const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/subscription-plans');
        if (response.data && response.data.status === 'success') {
          setPlans(response.data.data);
        } else {
          setPlans(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err: any) {
        console.error("Failed to fetch plans:", err);
        setError("Failed to load subscription plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-gray-50 flex justify-center font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 text-[11px] font-bold uppercase tracking-widest mb-6 shadow-sm">
            Pricing Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900 leading-[1.15]">
            Simple, Transparent Pricing.
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg font-medium">
            Choose the perfect plan to scale your restaurant. No hidden fees, no surprises.
          </p>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600 py-10 font-medium">
            {error}
          </div>
        )}

        {/* Pricing Cards Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => {
              // Highlight the middle plan or specific plan as popular
              const isPopular = i === 1 || plan.spm_code.toLowerCase().includes('premium');
              
              return (
                <div
                  key={plan.spm_id}
                  className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 bg-white border ${
                    isPopular 
                      ? 'border-red-600 shadow-xl scale-105 z-10' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-8 mt-4">
                    <h3 className="text-2xl font-extrabold mb-2 text-gray-900 tracking-tight">{plan.spm_name}</h3>
                    <p className="text-gray-500 text-sm h-10 font-medium">
                      {plan.spm_is_trial ? "Start with our free trial to explore." : `Perfect for up to ${plan.spm_max_tables} tables and ${plan.spm_max_branches} branches.`}
                    </p>
                  </div>

                  <div className="mb-8 pb-8 border-b border-gray-100">
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-black tracking-tight text-gray-900 leading-none">₹{plan.spm_price}</span>
                      <span className="text-gray-500 text-sm mb-1 font-medium">/{plan.spm_duration_days} days</span>
                    </div>
                  </div>

                  <div className="flex-grow mb-8">
                    <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">What's included:</h4>
                    <ul className="space-y-4">
                      {/* Plan Limits */}
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">Up to <strong>{plan.spm_max_tables}</strong> Tables</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">Up to <strong>{plan.spm_max_users}</strong> Staff Users</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 shrink-0" />
                        <span className="text-sm text-gray-700 font-medium"><strong>{plan.spm_max_branches}</strong> Branch(es)</span>
                      </li>
                      
                      {/* Custom Features array from DB */}
                      {(() => {
                        let features: string[] = [];
                        try {
                          if (Array.isArray(plan.spm_features)) {
                            features = plan.spm_features;
                          } else if (typeof plan.spm_features === 'string') {
                            // sometimes postgres array comes as string "{feat1,feat2}"
                            if (plan.spm_features.startsWith('{') && plan.spm_features.endsWith('}')) {
                                features = plan.spm_features.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                            } else {
                                features = JSON.parse(plan.spm_features);
                            }
                          }
                        } catch (e) {
                          console.error("Failed to parse spm_features", e);
                        }
                        
                        if (!Array.isArray(features)) {
                          features = [];
                        }

                        return features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-red-600 shrink-0" />
                            <span className="text-sm text-gray-700 font-medium">{feature}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>

                  {/* Button */}
                  <button
                    className={`mt-auto w-full py-4 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-[0.98] ${
                      isPopular
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
                        : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                    }`}
                  >
                    {plan.spm_is_trial ? "Start Free Trial" : "Get Started"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Payment Section */}
        <div className="mt-20 text-center border-t border-gray-200 pt-10">
          <p className="text-[11px] text-gray-400 mb-6 uppercase tracking-widest font-bold">Secure Payment Methods</p>
          <div className="flex justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-6" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;