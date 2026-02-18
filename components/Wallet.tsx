import React, { useState } from 'react';
import { DollarSign, CreditCard, Clock, ArrowUpRight, ArrowDownLeft, Landmark, Copy } from 'lucide-react';
import { User, DepositSettings } from '../types';

interface WalletProps {
  view: 'deposit' | 'history' | 'withdraw';
  user: User;
  depositSettings: DepositSettings;
}

const Wallet: React.FC<WalletProps> = ({ view, user, depositSettings }) => {
  const [amount, setAmount] = useState<string>('5.00');
  const [method, setMethod] = useState('paypal');

  const history = [
    { id: 1, type: 'Earning', desc: 'YouTube Watch Task', date: '2023-10-24 10:30', amount: '+0.025', status: 'Completed' },
    { id: 2, type: 'Deposit', desc: 'PayPal Deposit', date: '2023-10-23 15:45', amount: '+10.000', status: 'Completed' },
    { id: 3, type: 'Withdrawal', desc: 'Withdraw to Binance', date: '2023-10-20 09:15', amount: '-5.500', status: 'Pending' },
    { id: 4, type: 'Earning', desc: 'Signup Task', date: '2023-10-19 14:20', amount: '+0.100', status: 'Completed' },
    { id: 5, type: 'Earning', desc: 'Referral Bonus', date: '2023-10-18 11:00', amount: '+0.500', status: 'Completed' },
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if(Number(amount) > user.earnings) {
        alert("Insufficient earnings balance!");
        return;
    }
    alert(`Withdrawal request of $${amount} via ${method} submitted successfully!`);
  };
  
  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
  };

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      logo: (
         <div className="flex justify-center items-center h-full">
            <span className="text-xl font-bold italic text-[#003087]">Pay</span><span className="text-xl font-bold italic text-[#009cde]">Pal</span>
         </div>
      ),
      borderColor: 'border-[#003087]'
    },
    {
      id: 'zelle',
      name: 'Zelle',
      logo: (
        <div className="flex justify-center items-center h-full">
            <span className="text-xl font-bold text-[#6d1ed4]">Zelle</span>
        </div>
      ),
      borderColor: 'border-[#6d1ed4]'
    },
    {
        id: 'visa',
        name: 'Visa / Card',
        logo: (
            <div className="flex justify-center items-center h-full gap-1">
                <span className="text-xl font-bold text-[#1a1f71] italic">VISA</span>
                <span className="text-xs text-gray-400">/ MasterCard</span>
            </div>
        ),
        borderColor: 'border-[#1a1f71]'
    },
    {
        id: 'bank',
        name: 'Bank Transfer',
        logo: (
            <div className="flex justify-center items-center h-full text-gray-700 gap-2">
                <Landmark size={20} />
                <span className="text-sm font-bold">Bank</span>
            </div>
        ),
        borderColor: 'border-gray-500'
    },
    {
        id: 'bikash',
        name: 'Bikash',
        logo: (
            <div className="flex justify-center items-center h-full">
                <span className="text-xl font-bold text-[#e2136e]">bKash</span>
            </div>
        ),
        borderColor: 'border-[#e2136e]'
    }
  ];

  if (view === 'deposit') {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
         <div className="bg-blue-600 p-6 text-white text-center">
            <p className="text-blue-100 uppercase text-xs font-semibold tracking-wider">Current Deposit Balance</p>
            <h2 className="text-3xl font-bold mt-1">${user.deposit.toFixed(3)}</h2>
         </div>
         
         <div className="p-6">
            <h3 className="font-bold text-gray-800 mb-4">Deposit Funds</h3>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Method</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentMethods.map(m => (
                        <button 
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`h-16 border-2 rounded-lg relative transition-all hover:bg-gray-50 ${
                                method === m.id ? `${m.borderColor} bg-blue-50/30` : 'border-gray-200'
                            }`}
                        >
                            {m.logo}
                            {method === m.id && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Admin Provided Deposit Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3 border-b pb-2 flex justify-between items-center">
                    Payment Instructions
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Admin Configured</span>
                </p>
                
                {method === 'paypal' && (
                    <div className="animate-fadeIn">
                        <p className="text-sm text-gray-600 mb-1">Send payment to PayPal Email:</p>
                        <div className="flex items-center gap-2 bg-white p-2 border rounded">
                            <code className="text-sm font-bold text-gray-800 flex-1">{depositSettings.paypal}</code>
                            <button onClick={() => copyToClipboard(depositSettings.paypal)} className="text-blue-600 hover:text-blue-700"><Copy size={16}/></button>
                        </div>
                    </div>
                )}
                
                {method === 'zelle' && (
                    <div className="animate-fadeIn">
                        <p className="text-sm text-gray-600 mb-1">Send Zelle payment to:</p>
                        <div className="flex items-center gap-2 bg-white p-2 border rounded">
                            <code className="text-sm font-bold text-gray-800 flex-1">{depositSettings.zelle}</code>
                            <button onClick={() => copyToClipboard(depositSettings.zelle)} className="text-blue-600 hover:text-blue-700"><Copy size={16}/></button>
                        </div>
                    </div>
                )}
                
                {method === 'bank' && (
                    <div className="animate-fadeIn">
                        <p className="text-sm text-gray-600 mb-1">Bank Transfer Details:</p>
                        <div className="bg-white p-2 border rounded">
                            <pre className="text-sm font-bold text-gray-800 whitespace-pre-wrap font-sans">{depositSettings.bank}</pre>
                        </div>
                    </div>
                )}

                {method === 'bikash' && (
                    <div className="animate-fadeIn">
                        <p className="text-sm text-gray-600 mb-1">Send Money (Personal) to:</p>
                        <div className="flex items-center gap-2 bg-white p-2 border rounded">
                            <code className="text-sm font-bold text-[#e2136e] flex-1">{depositSettings.bikash}</code>
                            <button onClick={() => copyToClipboard(depositSettings.bikash)} className="text-[#e2136e] hover:opacity-80"><Copy size={16}/></button>
                        </div>
                    </div>
                )}
                
                {method === 'visa' && (
                     <div className="animate-fadeIn">
                        <p className="text-sm text-gray-600 mb-1">Pay via Credit Card:</p>
                        <a 
                            href={depositSettings.visa} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold text-sm mt-2"
                        >
                            Click to Pay Securely
                        </a>
                    </div>
                )}
            </div>

            <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Deposit ($)</label>
                 <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                    />
                 </div>
                 <div className="flex gap-2 mt-2">
                    {['5', '10', '20', '50'].map(val => (
                        <button 
                            key={val} 
                            onClick={() => setAmount(val)}
                            className="px-3 py-1 bg-gray-100 text-xs rounded-full hover:bg-gray-200 text-gray-600"
                        >
                            ${val}
                        </button>
                    ))}
                 </div>
            </div>

            {method !== 'visa' && (
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID / Sender Email</label>
                     <input type="text" placeholder="Enter proof of payment..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none mb-4" />
                </div>
            )}

            {method !== 'visa' ? (
                <button onClick={() => alert("Deposit request submitted! Admin will verify.")} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md">
                    Submit Deposit Request
                </button>
            ) : (
                <p className="text-xs text-center text-gray-500">Secure payment handled by external gateway.</p>
            )}
         </div>
      </div>
    );
  }

  if (view === 'withdraw') {
      return (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-green-600 p-6 text-white text-center">
                <p className="text-green-100 uppercase text-xs font-semibold tracking-wider">Withdrawable Earnings</p>
                <h2 className="text-3xl font-bold mt-1">${user.earnings.toFixed(3)}</h2>
            </div>
            
            <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ArrowUpRight className="text-green-600" size={20}/> Withdraw Earnings
                </h3>

                <form onSubmit={handleWithdraw}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* PayPal */}
                            <button 
                                type="button"
                                onClick={() => setMethod('paypal')}
                                className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${
                                    method === 'paypal' ? 'border-[#0070BA] bg-[#0070BA]/5 ring-2 ring-[#0070BA]' : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <span className={`text-xl font-bold italic ${method === 'paypal' ? 'text-[#0070BA]' : 'text-gray-600'}`}>PayPal</span>
                                {method === 'paypal' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0070BA]"></div>}
                            </button>

                            {/* Zelle */}
                            <button 
                                type="button"
                                onClick={() => setMethod('zelle')}
                                className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${
                                    method === 'zelle' ? 'border-[#6D1ED4] bg-[#6D1ED4]/5 ring-2 ring-[#6D1ED4]' : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <span className={`text-xl font-bold ${method === 'zelle' ? 'text-[#6D1ED4]' : 'text-gray-600'}`}>Zelle</span>
                                {method === 'zelle' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#6D1ED4]"></div>}
                            </button>

                            {/* Bank Account */}
                            <button 
                                type="button"
                                onClick={() => setMethod('bank')}
                                className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${
                                    method === 'bank' ? 'border-gray-700 bg-gray-100 ring-2 ring-gray-700' : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <Landmark size={24} className={method === 'bank' ? 'text-gray-800' : 'text-gray-500'} />
                                <span className={`text-sm font-bold ${method === 'bank' ? 'text-gray-800' : 'text-gray-600'}`}>Bank Transfer</span>
                                {method === 'bank' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-800"></div>}
                            </button>

                            {/* Bikash */}
                            <button 
                                type="button"
                                onClick={() => setMethod('bikash')}
                                className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${
                                    method === 'bikash' ? 'border-[#E2136E] bg-[#E2136E]/5 ring-2 ring-[#E2136E]' : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <span className={`text-xl font-bold ${method === 'bikash' ? 'text-[#E2136E]' : 'text-gray-600'}`}>bKash</span>
                                {method === 'bikash' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E2136E]"></div>}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="number" 
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg"
                                min="2.00"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: $2.00</p>
                    </div>

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-3 border-b pb-2">Account Details</p>
                        
                        {method === 'paypal' && (
                            <div className="animate-fadeIn">
                                <label className="block text-xs font-medium text-gray-700 mb-1">PayPal Email Address</label>
                                <input type="email" placeholder="email@example.com" className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-[#0070BA] outline-none" required />
                            </div>
                        )}

                        {method === 'bikash' && (
                            <div className="animate-fadeIn">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Bikash Personal Number</label>
                                <input type="tel" placeholder="e.g. 01712345678" className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-[#E2136E] outline-none" required />
                                <p className="text-[10px] text-gray-500 mt-1">Please ensure this is a personal account.</p>
                            </div>
                        )}

                        {method === 'bank' && (
                            <div className="space-y-3 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name</label>
                                    <input type="text" placeholder="e.g. Chase Bank" className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-gray-600 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
                                    <input type="text" placeholder="Full Name on Account" className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-gray-600 outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                                        <input type="text" className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-gray-600 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Routing/Swift</label>
                                        <input type="text" className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-gray-600 outline-none" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {method === 'zelle' && (
                            <div className="animate-fadeIn">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Zelle Registered Email or Mobile</label>
                                <input type="text" placeholder="email@example.com or Phone" className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-[#6D1ED4] outline-none" required />
                            </div>
                        )}
                    </div>

                    <button className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md flex justify-center items-center gap-2">
                        <ArrowUpRight size={18} /> Withdraw Money
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">Withdrawals are processed within 24-48 hours.</p>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" /> Transaction History
            </h3>
            <button className="text-xs text-blue-600 hover:underline">Download CSV</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {history.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{item.date}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-full ${
                                        item.type === 'Earning' ? 'bg-green-100 text-green-600' :
                                        item.type === 'Withdrawal' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {item.type === 'Earning' ? <ArrowDownLeft size={14} /> : 
                                         item.type === 'Withdrawal' ? <ArrowUpRight size={14} /> : <CreditCard size={14} />}
                                    </div>
                                    {item.desc}
                                </div>
                            </td>
                            <td className={`px-4 py-3 text-right font-bold ${item.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                {item.amount} $
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Wallet;