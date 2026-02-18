import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Job, User, Withdrawal, SupportTicket, VerificationRequest, Deposit, DepositSettings, AdSettings } from '../types';
import { 
  Trash2, Check, UserCheck, DollarSign, Users, Briefcase, 
  CreditCard, Shield, Headphones, Gift, LayoutDashboard, 
  XCircle, Search, AlertCircle, FileText, Eye, X, MapPin, Phone, Calendar, Mail, Settings, Send, Youtube, Landmark, Globe, Megaphone
} from 'lucide-react';
import { 
    saveDepositSettings, 
    saveAdSettings, 
    updateUserStatus, 
    deleteJob, 
    subscribeToAllUsers,
    sendBonusToUser
} from '../services/firebase';

interface AdminDashboardProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  youtubeLink: string;
  setYoutubeLink: (link: string) => void;
  telegramLink: string;
  setTelegramLink: (link: string) => void;
  depositSettings: DepositSettings;
  setDepositSettings: React.Dispatch<React.SetStateAction<DepositSettings>>;
  adSettings: AdSettings;
  setAdSettings: React.Dispatch<React.SetStateAction<AdSettings>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs, setJobs, youtubeLink, setYoutubeLink, telegramLink, setTelegramLink, depositSettings, setDepositSettings, adSettings, setAdSettings }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);
  
  // Bonus State
  const [bonusTarget, setBonusTarget] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusMessage, setBonusMessage] = useState('');
  const [isSendingBonus, setIsSendingBonus] = useState(false);
  
  // Realtime Users from Firebase
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
      // Subscribe to all users list
      const unsubscribe = subscribeToAllUsers((fetchedUsers) => {
          setUsers(fetchedUsers);
      });
      return () => unsubscribe();
  }, []);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    { id: 'W-101', userId: '184136', userName: 'John Doe', amount: 10.00, method: 'PayPal', accountDetails: 'john@paypal.com', status: 'Pending', date: '2023-10-25' },
    { id: 'W-102', userId: '184138', userName: 'Mike Ross', amount: 50.00, method: 'Binance', accountDetails: '0x123...abc', status: 'Approved', date: '2023-10-24' },
    { id: 'W-103', userId: '184135', userName: 'Tohin Ahmed', amount: 2.50, method: 'bKash', accountDetails: '01712345678', status: 'Pending', date: '2023-10-27' },
  ]);

  const [deposits, setDeposits] = useState<Deposit[]>([
    { id: 'D-501', userId: '184138', userName: 'Mike Ross', amount: 100.00, method: 'Stripe', accountDetails: 'TXN_123456789', status: 'Completed', date: '2023-10-15' },
    { id: 'D-502', userId: '184136', userName: 'John Doe', amount: 5.00, method: 'Coinbase', accountDetails: '0x3f5...1a2b', status: 'Completed', date: '2023-10-01' },
    { id: 'D-503', userId: '184135', userName: 'Tohin Ahmed', amount: 10.00, method: 'bKash', accountDetails: 'TrxID: 9HG78KL', status: 'Pending', date: '2023-10-28' },
  ]);

  const [verifications, setVerifications] = useState<VerificationRequest[]>([
    { 
      id: 'V-001', 
      userId: '184136', 
      userName: 'John Doe', 
      documentType: 'National ID', 
      status: 'Pending', 
      date: '2023-10-26',
      imageUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=300&h=300' 
    },
    { 
      id: 'V-002', 
      userId: '184138', 
      userName: 'Mike Ross', 
      documentType: 'Passport', 
      status: 'Verified', 
      date: '2023-10-10',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
    },
  ]);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'T-201', userId: '184137', userName: 'Jane Smith', subject: 'Account Banned', message: 'Why was my account banned?', status: 'Open', date: '2023-10-26' },
    { id: 'T-202', userId: '184136', userName: 'John Doe', subject: 'Payment Issue', message: 'Deposit not showing up.', status: 'Closed', date: '2023-10-20' },
  ]);

  // --- ACTIONS ---
  const handleJobDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this job?')) {
        await deleteJob(id);
        // Note: Realtime listener in App.tsx will update the `jobs` prop automatically
    }
  };

  const handleUserStatusChange = async (userId: string, newStatus: 'Active' | 'Banned') => {
    await updateUserStatus(userId, newStatus);
    // Realtime listener updates `users` state automatically
  };

  const handleWithdrawalAction = (id: string, action: 'Approved' | 'Rejected') => {
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: action } : w));
  };

  const handleVerificationAction = (id: string, action: 'Verified' | 'Rejected') => {
    setVerifications(verifications.map(v => v.id === id ? { ...v, status: action } : v));
  };
  
  const handleDepositAction = (id: string, action: 'Completed' | 'Failed') => {
    setDeposits(deposits.map(d => d.id === id ? { ...d, status: action } : d));
  };

  const handleSendBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusTarget || !bonusAmount) return;

    setIsSendingBonus(true);
    const amount = parseFloat(bonusAmount);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid bonus amount.");
        setIsSendingBonus(false);
        return;
    }

    if (bonusTarget === 'ALL') {
         if(!confirm(`Are you sure you want to send $${amount} to ALL ${users.length} users? This cannot be undone.`)) {
             setIsSendingBonus(false);
             return;
         }
         let count = 0;
         for(const user of users) {
             await sendBonusToUser(user.id, amount);
             count++;
         }
         alert(`Success! Bonus sent to ${count} users.`);
    } else {
        const user = users.find(u => u.id === bonusTarget || u.email === bonusTarget);
        if (user) {
            const success = await sendBonusToUser(user.id, amount);
            if (success) {
                alert(`Success! Bonus of $${amount} sent to ${user.name} (${user.email}).`);
            } else {
                alert("Failed to update user balance in Firebase.");
            }
        } else {
            alert("User not found! Please check the ID or Email.");
        }
    }
    
    setBonusTarget('');
    setBonusAmount('');
    setBonusMessage('');
    setIsSendingBonus(false);
  };

  const handleSaveDepositSettings = async () => {
      await saveDepositSettings(depositSettings);
      alert("Deposit account details saved to Firebase!");
  };

  const handleSaveAdSettings = async () => {
      await saveAdSettings(adSettings);
      alert("Ad configuration saved to Firebase! Changes will reflect in user dashboard.");
  };

  // --- RENDER CONTENT HELPERS ---
  const renderDashboard = () => (
    <div className="space-y-6">
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-xs uppercase">Total Users</p>
                    <p className="text-xl font-bold text-gray-800">{users.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Users size={20} /></div>
            </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-xs uppercase">Active Jobs</p>
                    <p className="text-xl font-bold text-gray-800">{jobs.length}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full text-green-600"><Briefcase size={20} /></div>
            </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-xs uppercase">Pending Withdrawals</p>
                    <p className="text-xl font-bold text-gray-800">${withdrawals.filter(w=>w.status==='Pending').reduce((a,b)=>a+b.amount,0)}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><DollarSign size={20} /></div>
            </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-xs uppercase">Total Deposit</p>
                    <p className="text-xl font-bold text-gray-800">${deposits.reduce((a,b)=>a+b.amount,0)}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full text-purple-600"><CreditCard size={20} /></div>
            </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-80">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                    { name: 'Mon', jobs: 400 }, { name: 'Tue', jobs: 300 }, { name: 'Wed', jobs: 200 },
                    { name: 'Thu', jobs: 278 }, { name: 'Fri', jobs: 189 }, { name: 'Sat', jobs: 239 }, { name: 'Sun', jobs: 349 }
                ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-80">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                    { name: 'Mon', rev: 240 }, { name: 'Tue', rev: 139 }, { name: 'Wed', rev: 980 },
                    { name: 'Thu', rev: 390 }, { name: 'Fri', rev: 480 }, { name: 'Sat', rev: 380 }, { name: 'Sun', rev: 430 }
                ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rev" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderUserModal = () => {
    if (!selectedUser) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden relative">
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <Users size={20} /> User Biodata
                    </h3>
                    <button onClick={() => setSelectedUser(null)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <img src={selectedUser.avatar} className="w-20 h-20 rounded-full border-4 border-blue-100 bg-gray-100" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                            <p className="text-gray-500 text-sm">ID: <span className="font-mono text-gray-700">{selectedUser.id}</span></p>
                            <div className="flex gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {selectedUser.status}
                                </span>
                                {selectedUser.isAdmin && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Admin</span>}
                                {selectedUser.verificationStatus && (
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                        selectedUser.verificationStatus === 'Verified' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {selectedUser.verificationStatus}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded border border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Mail size={12}/> Email</p>
                            <p className="font-medium text-sm truncate text-gray-800" title={selectedUser.email}>{selectedUser.email || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Phone size={12}/> Phone</p>
                            <p className="font-medium text-sm text-gray-800">{selectedUser.phone || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin size={12}/> Country</p>
                            <p className="font-medium text-sm text-gray-800">{selectedUser.country || 'N/A'}</p>
                        </div>
                         <div className="p-3 bg-gray-50 rounded border border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Calendar size={12}/> Joined</p>
                            <p className="font-medium text-sm text-gray-800">{selectedUser.joinedDate || 'N/A'}</p>
                        </div>
                    </div>
                    
                     <div className="mb-6">
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FileText size={12} /> Bio</p>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 min-h-[80px] max-h-[120px] overflow-y-auto">
                            {selectedUser.bio || <span className="text-gray-400 italic">No bio available.</span>}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 bg-green-50 p-3 rounded text-center border border-green-100">
                            <p className="text-xs text-green-600 font-semibold uppercase">Total Earnings</p>
                            <p className="font-bold text-lg text-green-700">${selectedUser.earnings.toFixed(3)}</p>
                        </div>
                        <div className="flex-1 bg-blue-50 p-3 rounded text-center border border-blue-100">
                            <p className="text-xs text-blue-600 font-semibold uppercase">Total Deposit</p>
                            <p className="font-bold text-lg text-blue-700">${selectedUser.deposit.toFixed(3)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
                     <div className="text-xs text-gray-500">
                        {selectedUser.gender && <span className="mr-3">Gender: {selectedUser.gender}</span>}
                        {selectedUser.age && <span>Age: {selectedUser.age}</span>}
                     </div>
                     <button onClick={() => setSelectedUser(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded transition-colors">Close Details</button>
                </div>
            </div>
        </div>
    );
  };

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">User Management & Biodata</h3>
            <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-2">
                <Search size={14} className="text-gray-400" />
                <input type="text" placeholder="Search users..." className="bg-transparent text-sm outline-none w-40" />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-3">User Profile</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Balance</th>
                        <th className="px-4 py-3">Level</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200 bg-white" alt="" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-400">ID: {user.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <p className="text-gray-700 text-xs">{user.email}</p>
                                <p className="text-gray-400 text-[10px]">{user.phone || 'No Phone'}</p>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col">
                                    <span className="text-green-600 font-medium text-xs">E: ${user.earnings.toFixed(2)}</span>
                                    <span className="text-blue-600 font-medium text-xs">D: ${user.deposit.toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs border ${
                                    user.membershipLevel === 'Gold' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                    user.membershipLevel === 'Silver' ? 'bg-gray-100 text-gray-800 border-gray-300' :
                                    'bg-white text-gray-600 border-gray-200'
                                }`}>
                                    {user.membershipLevel}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => setSelectedUser(user)}
                                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md border border-blue-200 transition-colors"
                                        title="View Biodata"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    {user.status === 'Active' ? (
                                        <button 
                                            onClick={() => handleUserStatusChange(user.id, 'Banned')} 
                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-md border border-red-200 transition-colors"
                                            title="Ban User"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleUserStatusChange(user.id, 'Active')} 
                                            className="text-green-500 hover:bg-green-50 p-1.5 rounded-md border border-green-200 transition-colors"
                                            title="Activate User"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/* Render Modal if user selected */}
        {renderUserModal()}
    </div>
  );

  const renderJobs = () => (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Job Management</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Progress</th>
                        <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-gray-500">{job.id}</td>
                            <td className="px-4 py-3 font-medium">{job.title}</td>
                            <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{job.category}</span></td>
                            <td className="px-4 py-3">
                                <div className="w-24 bg-gray-200 rounded-full h-1.5 mb-1">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${(job.completedCount/job.maxCount)*100}%`}}></div>
                                </div>
                                <span className="text-[10px] text-gray-500">{job.completedCount}/{job.maxCount}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button onClick={() => handleJobDelete(job.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
  );

  const renderWithdrawals = () => (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Withdrawal Requests</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-3">Req ID</th>
                        <th className="px-4 py-3">User Details</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Account No / Email</th>
                         <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{w.id}</td>
                            <td className="px-4 py-3">
                                <div>
                                    <p className="font-semibold text-gray-800">{w.userName}</p>
                                    <p className="text-xs text-gray-500">ID: {w.userId}</p>
                                </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-gray-800">${w.amount.toFixed(2)}</td>
                            <td className="px-4 py-3">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100 capitalize">
                                    {w.method}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-700">{w.accountDetails}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{w.date}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                    w.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                    w.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{w.status}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                {w.status === 'Pending' && (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleWithdrawalAction(w.id, 'Approved')} className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors" title="Approve">
                                            <Check size={16}/>
                                        </button>
                                        <button onClick={() => handleWithdrawalAction(w.id, 'Rejected')} className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors" title="Reject">
                                            <XCircle size={16}/>
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
  );

  const renderDeposits = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Deposit History</h3>
      </div>
      <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">User Details</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Account / TxID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {deposits.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.id}</td>
                          <td className="px-4 py-3">
                                <div>
                                    <p className="font-semibold text-gray-800">{d.userName}</p>
                                    <p className="text-xs text-gray-500">ID: {d.userId}</p>
                                </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-blue-600">+${d.amount.toFixed(2)}</td>
                          <td className="px-4 py-3">
                              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs border border-purple-100 capitalize">
                                {d.method}
                              </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-700">{d.accountDetails || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{d.date}</td>
                          <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                d.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                d.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {d.status}
                              </span>
                          </td>
                           <td className="px-4 py-3 text-right">
                                {d.status === 'Pending' && (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleDepositAction(d.id, 'Completed')} className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors" title="Approve">
                                            <Check size={16}/>
                                        </button>
                                        <button onClick={() => handleDepositAction(d.id, 'Failed')} className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors" title="Reject">
                                            <XCircle size={16}/>
                                        </button>
                                    </div>
                                )}
                            </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );

  const renderVerification = () => (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Account Verification Requests</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Document</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {verifications.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{v.userName}</td>
                            <td className="px-4 py-3 flex items-center gap-2">
                                <FileText size={14} className="text-gray-400" /> 
                                <span>{v.documentType}</span>
                                {v.imageUrl && (
                                    <button 
                                        onClick={() => setSelectedProofImage(v.imageUrl!)}
                                        className="ml-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <Eye size={12} /> View Proof
                                    </button>
                                )}
                            </td>
                            <td className="px-4 py-3 text-gray-500">{v.date}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    v.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                                    v.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>{v.status}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                {v.status === 'Pending' && (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleVerificationAction(v.id, 'Verified')} className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">Verify</button>
                                        <button onClick={() => handleVerificationAction(v.id, 'Rejected')} className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100">Reject</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/* Proof Image Modal */}
        {selectedProofImage && (
            <div className="fixed inset-0 z-[60] bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setSelectedProofImage(null)}>
                <div className="relative max-w-2xl w-full bg-white rounded-lg p-2">
                     <button 
                        onClick={() => setSelectedProofImage(null)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                     >
                         <X size={20} />
                     </button>
                     <img src={selectedProofImage} alt="Proof" className="w-full h-auto rounded" />
                     <div className="p-4 bg-white text-center">
                         <p className="font-bold text-gray-800">Identity Verification Proof</p>
                         <p className="text-xs text-gray-500">Selfie with Document</p>
                     </div>
                </div>
            </div>
        )}
      </div>
  );

  const renderSupport = () => (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Support Tickets</h3>
        </div>
        <div className="divide-y divide-gray-100">
            {tickets.map((t) => (
                <div key={t.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                             <h4 className="font-bold text-gray-800 text-sm">{t.subject} <span className="text-gray-400 font-normal">#{t.id}</span></h4>
                             <p className="text-xs text-blue-600">{t.userName}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{t.message}</p>
                    <div className="mt-3 flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline">Reply</button>
                        <button className="text-xs text-gray-500 hover:underline">Close Ticket</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
  );

  const renderBonus = () => (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Gift className="text-pink-500" /> Send Bonus to Users
        </h3>
        <form onSubmit={handleSendBonus} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User (ID or Email)</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={bonusTarget}
                        onChange={(e) => setBonusTarget(e.target.value)}
                        placeholder="e.g. 184135 or user@example.com" 
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setBonusTarget('ALL')}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 whitespace-nowrap"
                    >
                        All Users
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Amount ($)</label>
                <input 
                    type="number" 
                    step="0.001" 
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="0.00" 
                    required 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea 
                    value={bonusMessage}
                    onChange={(e) => setBonusMessage(e.target.value)}
                    className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Congratulations! Here is a bonus for you."
                ></textarea>
            </div>
            <button 
                type="submit"
                disabled={isSendingBonus}
                className={`w-full py-2 bg-pink-600 text-white font-bold rounded hover:bg-pink-700 shadow-sm transition-opacity ${isSendingBonus ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isSendingBonus ? 'Sending Bonus...' : 'Send Bonus'}
            </button>
        </form>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        {/* Ads Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Megaphone className="text-orange-500" /> Adsterra / Ads Configuration
            </h3>
            <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                     <input 
                        type="checkbox" 
                        id="enableAds"
                        checked={adSettings.isEnabled}
                        onChange={(e) => setAdSettings(prev => ({...prev, isEnabled: e.target.checked}))}
                        className="w-4 h-4 text-blue-600 rounded"
                     />
                     <label htmlFor="enableAds" className="text-sm font-medium text-gray-700">Enable Ads for Free & Silver Users</label>
                 </div>

                 <div className="bg-gray-50 p-4 rounded border border-gray-200">
                     <h4 className="text-sm font-bold text-gray-800 mb-3">Banner Ad (Top of Feed)</h4>
                     <div className="space-y-3">
                         <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Banner Image URL</label>
                            <input 
                                type="text" 
                                value={adSettings.bannerImageUrl}
                                onChange={(e) => setAdSettings(prev => ({...prev, bannerImageUrl: e.target.value}))}
                                className="w-full p-2 border rounded text-sm outline-none"
                                placeholder="https://example.com/banner.jpg"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Target Link (Where user goes on click)</label>
                            <input 
                                type="text" 
                                value={adSettings.bannerTargetUrl}
                                onChange={(e) => setAdSettings(prev => ({...prev, bannerTargetUrl: e.target.value}))}
                                className="w-full p-2 border rounded text-sm outline-none"
                                placeholder="https://adsterra.com/..."
                            />
                         </div>
                     </div>
                 </div>

                 <div className="bg-gray-50 p-4 rounded border border-gray-200">
                     <h4 className="text-sm font-bold text-gray-800 mb-3">Direct Link Ad (Button)</h4>
                     <div className="space-y-3">
                         <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Direct Ad Link URL</label>
                            <input 
                                type="text" 
                                value={adSettings.directLinkUrl}
                                onChange={(e) => setAdSettings(prev => ({...prev, directLinkUrl: e.target.value}))}
                                className="w-full p-2 border rounded text-sm outline-none"
                                placeholder="https://direct-link.net/..."
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                            <input 
                                type="text" 
                                value={adSettings.directLinkText}
                                onChange={(e) => setAdSettings(prev => ({...prev, directLinkText: e.target.value}))}
                                className="w-full p-2 border rounded text-sm outline-none"
                                placeholder="CLICK HERE FOR BONUS"
                            />
                         </div>
                     </div>
                 </div>

                 <div className="flex justify-end">
                     <button onClick={handleSaveAdSettings} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium text-sm">
                        Save Ad Settings
                    </button>
                 </div>
            </div>
        </div>

        {/* Payment Method Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" /> Deposit Payment Methods
            </h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
                        <input 
                            type="text" 
                            value={depositSettings.paypal}
                            onChange={(e) => setDepositSettings(prev => ({...prev, paypal: e.target.value}))}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zelle ID / Number</label>
                        <input 
                            type="text" 
                            value={depositSettings.zelle}
                            onChange={(e) => setDepositSettings(prev => ({...prev, zelle: e.target.value}))}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Details (Display Text)</label>
                     <textarea 
                        value={depositSettings.bank}
                        onChange={(e) => setDepositSettings(prev => ({...prev, bank: e.target.value}))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24"
                     ></textarea>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Visa/Card Payment Link</label>
                     <input 
                        type="text" 
                        value={depositSettings.visa}
                        onChange={(e) => setDepositSettings(prev => ({...prev, visa: e.target.value}))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="https://..."
                     />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Bikash Number (Personal/Agent)</label>
                     <input 
                        type="text" 
                        value={depositSettings.bikash}
                        onChange={(e) => setDepositSettings(prev => ({...prev, bikash: e.target.value}))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="017xxxxxxxx"
                     />
                </div>
                <div className="flex justify-end">
                     <button onClick={handleSaveDepositSettings} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm">
                        Update Payment Details
                    </button>
                </div>
            </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Settings className="text-gray-600" /> General Settings
            </h3>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Youtube size={16} className="text-red-600" /> YouTube Channel Link
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                            placeholder="https://youtube.com/..."
                        />
                        <button onClick={() => alert("YouTube Link Saved!")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm">
                            Save
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Send size={16} className="text-blue-500" /> Official Channel (Telegram) Link
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={telegramLink}
                            onChange={(e) => setTelegramLink(e.target.value)}
                            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                            placeholder="https://t.me/..."
                        />
                        <button onClick={() => alert("Telegram Link Saved!")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm">
                            Save
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">These links will be displayed in the user sidebar for quick access.</p>
                </div>
            </div>
        </div>
    </div>
  );

  // --- MENU ITEMS CONFIG ---
  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { id: 'users', label: 'Users & Posters', icon: <Users size={18} /> },
      { id: 'jobs', label: 'Manage Jobs', icon: <Briefcase size={18} /> },
      { id: 'withdrawals', label: 'Withdrawals', icon: <DollarSign size={18} /> },
      { id: 'deposits', label: 'Deposits', icon: <CreditCard size={18} /> },
      { id: 'verification', label: 'Verification', icon: <Shield size={18} /> },
      { id: 'support', label: 'Support', icon: <Headphones size={18} /> },
      { id: 'bonus', label: 'Send Bonus', icon: <Gift size={18} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[500px]">
      {/* Admin Sidebar */}
      <div className="w-full md:w-56 flex-shrink-0">
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 bg-gray-800 text-white">
                 <h3 className="font-bold text-sm">ADMIN PANEL</h3>
             </div>
             <nav className="p-2">
                 {menuItems.map(item => (
                     <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md mb-1 transition-colors ${
                            activeView === item.id 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                     >
                         {item.icon}
                         {item.label}
                     </button>
                 ))}
             </nav>
         </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-1 animate-fadeIn">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'users' && renderUsers()}
          {activeView === 'jobs' && renderJobs()}
          {activeView === 'withdrawals' && renderWithdrawals()}
          {activeView === 'deposits' && renderDeposits()}
          {activeView === 'verification' && renderVerification()}
          {activeView === 'support' && renderSupport()}
          {activeView === 'bonus' && renderBonus()}
          {activeView === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;