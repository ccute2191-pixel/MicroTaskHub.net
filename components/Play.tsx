import React, { useState } from 'react';
import { Gamepad2, Gift, RefreshCw } from 'lucide-react';

const Play: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<string | null>(null);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setReward(null);
    
    setTimeout(() => {
        setSpinning(false);
        const win = Math.random() > 0.5;
        setReward(win ? '$0.002' : 'Try Again');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
            
            <Gamepad2 size={48} className="mx-auto mb-4 text-purple-200" />
            <h2 className="text-3xl font-bold mb-2">Daily Spin</h2>
            <p className="text-purple-200 mb-8">Spin the wheel every 24 hours to win free cash prizes!</p>

            <div className="relative w-48 h-48 mx-auto mb-8">
                <div className={`w-full h-full rounded-full border-8 border-white/20 flex items-center justify-center bg-purple-800 shadow-inner ${spinning ? 'animate-spin' : ''}`}>
                    {spinning ? (
                        <RefreshCw size={48} className="text-white/50" />
                    ) : (
                        <span className="text-2xl font-bold text-yellow-400">{reward || 'SPIN'}</span>
                    )}
                </div>
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2 text-yellow-400">▼</div>
            </div>

            <button 
                onClick={handleSpin}
                disabled={spinning}
                className="w-full py-3 bg-yellow-400 text-yellow-900 font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {spinning ? 'Spinning...' : 'SPIN NOW'}
            </button>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-left">Recent Winners</h3>
                <Gift className="text-pink-500" size={18} />
            </div>
            <div className="space-y-3">
                {[1,2,3].map(i => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">User_{Math.floor(Math.random()*9000)+1000}</span>
                        <span className="text-green-600 font-bold">+$0.00{Math.floor(Math.random()*9)+1}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Play;