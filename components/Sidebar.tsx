
import React from 'react';
import { 
  Briefcase, 
  Home, 
  PlusCircle, 
  User as UserIcon, 
  Bell, 
  DollarSign, 
  Share2, 
  History, 
  MonitorPlay, 
  HelpCircle,
  ShieldCheck,
  ArrowUpCircle,
  Youtube,
  Send
} from 'lucide-react';
import { User } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  youtubeLink: string;
  telegramLink: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, activeTab, setActiveTab, youtubeLink, telegramLink }) => {
  const menuItems = [
    { id: 'jobs', label: 'Find Jobs', icon: <Home size={18} /> },
    { id: 'premium', label: 'Premium', icon: <ShieldCheck size={18} />, color: 'text-orange-500' },
    { id: 'post', label: 'Post New Job', icon: <PlusCircle size={18} /> },
    { id: 'my-work', label: 'My Work', icon: <Briefcase size={18} /> },
    { id: 'my-jobs', label: 'My Jobs', icon: <UserIcon size={18} /> },
    { id: 'withdraw', label: 'Withdraw', icon: <ArrowUpCircle size={18} /> },
    { id: 'deposit', label: 'Deposit', icon: <DollarSign size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'share', label: 'Share & Earn', icon: <Share2 size={18} /> },
    { id: 'history', label: 'Transactions History', icon: <History size={18} /> },
    { id: 'play', label: 'Play & Earn', icon: <MonitorPlay size={18} /> },
    { id: 'ticket', label: 'Support Ticket', icon: <HelpCircle size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-16 lg:pt-0 flex flex-col`}
      >
        <div className="flex items-center p-4 border-b lg:hidden">
            <Logo />
        </div>

        <div className="p-4 bg-blue-50 m-2 rounded-lg border border-blue-100 lg:mt-4 flex-shrink-0">
            <div className="flex items-center gap-3">
                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-green-500" />
                <div>
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-1 rounded border">
                    <p className="text-[10px] text-gray-500">Earnings</p>
                    <p className="text-xs font-bold text-green-600">${user.earnings.toFixed(3)}</p>
                </div>
                <div className="bg-white p-1 rounded border">
                    <p className="text-[10px] text-gray-500">Deposit</p>
                    <p className="text-xs font-bold text-blue-600">${user.deposit.toFixed(3)}</p>
                </div>
            </div>
        </div>

        <nav className="mt-2 overflow-y-auto flex-1">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={item.color || ''}>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Official Links Section */}
        <div className="p-4 border-t flex-shrink-0 space-y-2 bg-gray-50">
            {telegramLink && (
                <a 
                    href={telegramLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 transition-colors font-medium text-xs"
                >
                    <Send size={14} /> Official Channel
                </a>
            )}
            
            {youtubeLink && (
                <a 
                    href={youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 transition-colors font-medium text-xs"
                >
                    <Youtube size={14} /> YouTube Channel
                </a>
            )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
