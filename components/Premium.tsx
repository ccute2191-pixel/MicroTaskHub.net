import React from 'react';
import { Check, Crown, Shield } from 'lucide-react';

const Premium: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      features: ['Basic Job Access', 'Standard Payouts', 'Email Support'],
      color: 'gray',
      button: 'Current Plan'
    },
    {
      name: 'Silver',
      price: '$2.00',
      period: '/month',
      features: ['Access High Paying Jobs', 'Priority Support', 'No Withdrawal Fees', 'Highlighted Profile'],
      color: 'blue',
      button: 'Upgrade to Silver',
      popular: true
    },
    {
      name: 'Gold',
      price: '$6.00',
      period: '/month',
      features: ['All Silver Features', 'Instant Withdrawals', 'Top Job Listings', 'Dedicated Account Manager', '2x Referral Bonus'],
      color: 'yellow',
      button: 'Upgrade to Gold'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Upgrade Your Experience</h2>
            <p className="text-gray-500">Unlock higher earnings and exclusive features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
                <div key={plan.name} className={`relative bg-white rounded-xl shadow-sm border-2 p-6 flex flex-col ${plan.popular ? 'border-blue-500 ring-4 ring-blue-50 scale-105 z-10' : 'border-gray-100'}`}>
                    {plan.popular && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Most Popular
                        </div>
                    )}
                    <div className="mb-4">
                        <h3 className={`text-lg font-bold ${plan.name === 'Gold' ? 'text-yellow-600' : 'text-gray-800'}`}>{plan.name}</h3>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                            {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                        </div>
                    </div>

                    <ul className="flex-1 space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                        plan.name === 'Starter' 
                        ? 'bg-gray-100 text-gray-500 cursor-default' 
                        : plan.name === 'Gold' 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                        {plan.button}
                    </button>
                </div>
            ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white flex items-center justify-between shadow-lg mt-8">
            <div>
                <h3 className="text-xl font-bold flex items-center gap-2"><Crown /> Lifetime Membership</h3>
                <p className="text-indigo-100 opacity-90 text-sm mt-1">One time payment. Forever benefits.</p>
            </div>
            <div className="text-right">
                 <span className="block text-2xl font-bold">$25.00</span>
                 <button className="bg-white text-indigo-600 px-4 py-2 rounded font-bold text-sm mt-2 hover:bg-gray-50">Buy Now</button>
            </div>
        </div>
    </div>
  );
};

export default Premium;