import React from 'react';
import { Bell, Copy, Share2, Facebook, Twitter, MessageCircle, Send, Headphones } from 'lucide-react';

interface SocialProps {
  view: 'notifications' | 'share' | 'ticket';
}

const Social: React.FC<SocialProps> = ({ view }) => {
  if (view === 'notifications') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-fadeIn">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Bell size={18} className="text-orange-500" /> Notifications
            </h3>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">3 New</span>
        </div>
        <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`p-4 hover:bg-gray-50 transition-colors ${i <= 3 ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex gap-3">
                        <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div>
                            <p className="text-sm text-gray-800">
                                {i === 1 ? 'Your withdrawal of $5.50 has been processed successfully.' :
                                 i === 2 ? 'New bonus job available: "Install App & Review"' :
                                 'Welcome to MicroTaskHub! Verify your email to earn $0.05.'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  if (view === 'share') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center shadow-lg">
            <Share2 size={48} className="mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-2">Invite Friends & Earn</h2>
            <p className="text-blue-100 mb-6">Earn <span className="font-bold text-white">5%</span> of your friends' deposit and <span className="font-bold text-white">2%</span> of their earnings for life!</p>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center border border-white/20">
                <code className="flex-1 bg-black/20 px-4 py-2 rounded text-lg font-mono tracking-wider">
                    https://microtaskhub.com/ref/184135
                </code>
                <button 
                    onClick={() => alert("Copied to clipboard!")}
                    className="px-6 py-2 bg-white text-blue-600 font-bold rounded hover:bg-blue-50 flex items-center gap-2"
                >
                    <Copy size={16} /> Copy
                </button>
            </div>
         </div>

         <div className="grid grid-cols-3 gap-4">
            <button className="p-4 bg-[#1877F2] text-white rounded-lg flex flex-col items-center gap-2 hover:opacity-90">
                <Facebook /> <span className="text-sm font-bold">Facebook</span>
            </button>
            <button className="p-4 bg-[#1DA1F2] text-white rounded-lg flex flex-col items-center gap-2 hover:opacity-90">
                <Twitter /> <span className="text-sm font-bold">Twitter</span>
            </button>
            <button className="p-4 bg-[#25D366] text-white rounded-lg flex flex-col items-center gap-2 hover:opacity-90">
                <MessageCircle /> <span className="text-sm font-bold">Whatsapp</span>
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Headphones className="text-blue-600" /> Support Ticket
        </h2>
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Payment Issue</option>
                    <option>Account Verification</option>
                    <option>Report a Job</option>
                    <option>Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                    className="w-full p-2 border border-gray-300 rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Describe your issue..."
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
                <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <button className="w-full py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                <Send size={16} /> Submit Ticket
            </button>
        </form>
    </div>
  );
};

export default Social;