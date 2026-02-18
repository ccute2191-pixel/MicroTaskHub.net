import React, { useState, useEffect } from 'react';
import { HashRouter, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import AdminDashboard from './components/AdminDashboard';
import PostJob from './components/PostJob';
import Premium from './components/Premium';
import Wallet from './components/Wallet';
import Social from './components/Social';
import Activity from './components/Activity';
import Play from './components/Play';
import Profile from './components/Profile';
import Login from './components/Login';
import { Logo } from './components/Logo';
import { INITIAL_JOBS, MOCK_USER, CATEGORIES, COUNTRIES } from './constants';
import { Job, User, DepositSettings, AdSettings } from './types';
import { 
  Bell, 
  Menu, 
  Search, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  Settings,
  X,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { 
    subscribeToJobs, 
    subscribeToUser, 
    subscribeToDepositSettings, 
    subscribeToAdSettings,
    createJobWithId,
    updateUserBalance,
    updateJobProgress,
    subscribeToAuthChanges,
    logoutUser,
    initializeUserInDb
} from './services/firebase';

const ADMIN_EMAIL = 'ccute2191@gmail.com';

const App: React.FC = () => {
  // Global State
  const [authUser, setAuthUser] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [youtubeLink, setYoutubeLink] = useState('https://www.youtube.com/@MicroTaskHub');
  const [telegramLink, setTelegramLink] = useState('https://t.me/MicroTaskHub');
  const [isLoading, setIsLoading] = useState(true);
  
  // Admin Access Control
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);

  // Deposit Method Settings
  const [depositSettings, setDepositSettings] = useState<DepositSettings>({
      paypal: 'admin@microtaskhub.com',
      zelle: 'payments@microtaskhub.com',
      bank: 'Bank: Chase Bank\nAccount: 9876543210\nRouting: 123456789\nName: MicroTask Ltd',
      visa: 'https://checkout.stripe.com/pay/example-link',
      bikash: '01700000000'
  });

  // Ads Settings
  const [adSettings, setAdSettings] = useState<AdSettings>({
      isEnabled: true,
      bannerImageUrl: 'https://placehold.co/600x100/orange/white?text=Adsterra+Banner+Ad+Here',
      bannerTargetUrl: '#',
      directLinkUrl: '#',
      directLinkText: '🔥 CLICK HERE TO CLAIM DAILY BONUS 🔥'
  });
  
  // Job Filtering State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('International');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // --- AUTH & FIREBASE INIT ---
  useEffect(() => {
      // Listen for Auth Changes
      const unsubscribeAuth = subscribeToAuthChanges(async (firebaseUser) => {
          if (firebaseUser) {
              setAuthUser(firebaseUser);
              // Ensure user exists in DB
              const dbUser = await initializeUserInDb(firebaseUser);
              setUser(dbUser as User);
          } else {
              setAuthUser(null);
              setCanAccessAdmin(false);
              // Note: We do NOT set user to null here automatically.
              // This allows the "Guest Preview" mode to persist until explicit logout.
          }
          setIsLoading(false);
      });

      return () => unsubscribeAuth();
  }, []);

  // Check for admin privileges persistently based on EMAIL
  useEffect(() => {
      if (user && user.email === ADMIN_EMAIL) {
          setCanAccessAdmin(true);
      } else {
          setCanAccessAdmin(false);
      }
  }, [user]);

  useEffect(() => {
    // Only subscribe to global data if we have an authenticated user (real Firebase user)
    // If guest/demo mode (user exists but authUser is null), we use initial state (mock data) to avoid Permission Denied errors
    if (!authUser) return;

    const unsubscribeJobs = subscribeToJobs((fetchedJobs) => {
        if(fetchedJobs && fetchedJobs.length > 0) {
            setJobs(fetchedJobs);
        }
    });

    const unsubscribeDeposit = subscribeToDepositSettings((settings) => {
        if(settings) setDepositSettings(settings);
    });

    const unsubscribeAds = subscribeToAdSettings((settings) => {
        if(settings) setAdSettings(settings);
    });

    return () => {
        unsubscribeJobs();
        unsubscribeDeposit();
        unsubscribeAds();
    };
  }, [authUser]);

  // Listen to User Data Changes when Logged In (Real Auth Only)
  useEffect(() => {
      if (!authUser) return;
      const unsubscribeUser = subscribeToUser(authUser.uid, (fetchedUser) => {
          setUser(prev => {
              if (prev && prev.id === fetchedUser.id) {
                  // If locally toggled to worker view but email is admin, keep local toggle logic implicitly
                  // by updating the rest of the user object
                  return fetchedUser;
              }
              return fetchedUser;
          });
      });
      return () => unsubscribeUser();
  }, [authUser]);


  // Simulate window resize handler to auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWorkJob = async (job: Job) => {
    if (!user) return;
    const newEarnings = user.earnings + job.payout;
    const newCompletedCount = Math.min(job.completedCount + 1, job.maxCount);

    if (authUser) {
        await updateUserBalance(user.id, newEarnings, user.deposit);
        await updateJobProgress(job.id, newCompletedCount);
    } else {
        // Guest mode simulation
        setUser({...user, earnings: newEarnings});
    }
    alert(`Success! You earned $${job.payout.toFixed(3)} for completing "${job.title}"`);
  };

  const handlePostJob = async (newJob: Job) => {
    if (authUser) {
        await createJobWithId(newJob);
    } else {
        setJobs(prev => [...prev, newJob]);
    }
    setActiveTab('jobs');
    alert("Job Posted Successfully!");
  };

  const toggleAdmin = () => {
    // Only allow toggle if the email matches exactly
    if (user && user.email === ADMIN_EMAIL) {
        setUser(prev => prev ? ({ ...prev, isAdmin: !prev.isAdmin }) : null);
        setShowUserMenu(false);
    }
  };

  const handleLogout = async () => {
      await logoutUser();
      setUser(null); // Explicitly clear user on logout
      setAuthUser(null);
      setCanAccessAdmin(false);
      setShowUserMenu(false);
  };

  const handleDemoLogin = () => {
      // Set mock user for guest preview with Admin capabilities
      setUser(MOCK_USER);
  };

  const filteredJobs = jobs.filter(job => {
    const catMatch = selectedCategory === 'All' || 
                     job.category.toLowerCase().includes(selectedCategory.toLowerCase()) || 
                     job.title.toLowerCase().includes(selectedCategory.toLowerCase());
    let locMatch = true;
    if (selectedLocation === 'International') {
        locMatch = job.targetCountry === 'International';
    } else {
        locMatch = job.targetCountry === selectedLocation || job.targetCountry === 'International';
    }
    return catMatch && locMatch;
  });

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  // SHOW LOGIN IF NOT AUTHENTICATED
  if (!user) {
      return <Login onDemoLogin={handleDemoLogin} />;
  }

  const renderContent = () => {
    if (activeTab === 'profile') {
        return <Profile user={user} />;
    }

    // STRICT CHECK: Only show Admin Dashboard if isAdmin is true AND email matches
    if (user.isAdmin && user.email === ADMIN_EMAIL) {
        return (
            <AdminDashboard 
                jobs={jobs} 
                setJobs={setJobs} 
                youtubeLink={youtubeLink} 
                setYoutubeLink={setYoutubeLink} 
                telegramLink={telegramLink}
                setTelegramLink={setTelegramLink}
                depositSettings={depositSettings}
                setDepositSettings={setDepositSettings}
                adSettings={adSettings}
                setAdSettings={setAdSettings}
            />
        );
    }

    const showAds = adSettings.isEnabled && !user.isAdmin && (user.membershipLevel === 'Free' || user.membershipLevel === 'Silver');

    switch (activeTab) {
        case 'jobs':
            return (
                <div className="space-y-4 animate-fadeIn">
                    {showAds && adSettings.directLinkUrl && (
                        <a 
                            href={adSettings.directLinkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-pulse font-bold text-sm tracking-wide flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={16} />
                            {adSettings.directLinkText}
                        </a>
                    )}

                    {showAds && adSettings.bannerImageUrl && (
                        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex justify-center p-2">
                             <a href={adSettings.bannerTargetUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                                <img 
                                    src={adSettings.bannerImageUrl} 
                                    alt="Sponsored" 
                                    className="w-full h-auto max-h-32 object-cover rounded" 
                                />
                                <div className="text-[10px] text-right text-gray-400 mt-1">Sponsored Ad</div>
                             </a>
                        </div>
                    )}

                    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-wrap gap-2 sticky top-0 z-10">
                        <button 
                            onClick={() => setShowCategoryModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-sm"
                        >
                            {selectedCategory === 'All' ? 'Select Category' : selectedCategory}
                        </button>
                        <button 
                            onClick={() => setShowLocationModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <MapPin size={14} />
                            {selectedLocation}
                        </button>
                        <div className="ml-auto flex items-center">
                            <span className="text-xs text-gray-500 mr-2">Sort By:</span>
                            <select className="text-sm bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer">
                                <option>Newest</option>
                                <option>High Paying</option>
                            </select>
                        </div>
                    </div>

                    <div className="pb-20">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <JobCard key={job.id} job={job} onWork={handleWorkJob} />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <div className="mb-2">No jobs found matching your criteria.</div>
                                <button 
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSelectedLocation('International');
                                    }}
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        case 'premium': return <Premium />;
        case 'post': return <PostJob onPost={handlePostJob} onCancel={() => setActiveTab('jobs')} />;
        case 'my-work': return <Activity view="my-work" jobs={jobs} />;
        case 'my-jobs': return <Activity view="my-jobs" jobs={jobs} />;
        case 'withdraw': return <Wallet view="withdraw" user={user} depositSettings={depositSettings} />;
        case 'deposit': return <Wallet view="deposit" user={user} depositSettings={depositSettings} />;
        case 'history': return <Wallet view="history" user={user} depositSettings={depositSettings} />;
        case 'notifications': return <Social view="notifications" />;
        case 'share': return <Social view="share" />;
        case 'ticket': return <Social view="ticket" />;
        case 'play': return <Play />;
        default: return null;
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="fixed top-0 w-full bg-blue-600 text-white z-50 shadow-md h-16">
          <div className="flex items-center justify-between px-4 h-full max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 hover:bg-blue-700 rounded lg:hidden"
                >
                    <Menu size={24} />
                </button>
                
                {/* Logo Section - Visible on all screens in header */}
                <div className="flex items-center gap-2 mr-4 cursor-pointer" onClick={() => setActiveTab('jobs')}>
                     <Logo className="text-white [&_span]:text-white [&_svg]:text-white [&_.bg-white]:bg-blue-500 [&_.text-green-500]:text-green-300" />
                </div>

                <div className="hidden md:flex items-center bg-blue-700/50 rounded-full px-4 py-1.5 border border-blue-500/30">
                     <Search size={16} className="text-blue-200 mr-2" />
                     <input 
                        type="text" 
                        placeholder="microtaskhub.com/jobs" 
                        className="bg-transparent border-none outline-none text-sm text-white placeholder-blue-200 w-48"
                        disabled
                     />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
                    <div className="bg-blue-800/60 px-3 py-1.5 rounded flex items-center gap-2">
                        <span>Earning:</span>
                        <span className="text-green-300">{user.earnings.toFixed(3)}</span>
                    </div>
                    <div className="bg-green-600 px-3 py-1.5 rounded flex items-center gap-2">
                        <span>Deposit:</span>
                        <span className="text-white">{user.deposit.toFixed(3)}</span>
                    </div>
                     <div className="bg-yellow-500 px-3 py-1.5 rounded flex items-center gap-2 text-blue-900 shadow-sm border border-yellow-400">
                        <span>{user.membershipLevel}</span>
                    </div>
                </div>

                <div className="relative cursor-pointer" onClick={() => setActiveTab('notifications')}>
                    <Bell size={20} className="text-blue-100 hover:text-white" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600"></span>
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-1 focus:outline-none"
                    >
                        <img src={user.avatar} className="w-8 h-8 rounded-full border border-blue-300 bg-white" alt="Profile" />
                        <ChevronDown size={14} className="text-blue-200" />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 text-gray-700 animate-fadeIn origin-top-right z-50">
                             <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-xs font-bold text-gray-500">HELLO, {user.name.toUpperCase()}</p>
                                {!authUser && <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500">Guest Mode</span>}
                             </div>
                             <button 
                                onClick={() => {
                                    setActiveTab('profile');
                                    setShowUserMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-left"
                             >
                                <UserIcon size={16} /> My profile
                             </button>
                             
                             {/* ONLY SHOW ADMIN TOGGLE IF EMAIL MATCHES SPECIFIC ADMIN EMAIL */}
                             {canAccessAdmin && (
                                 <button onClick={toggleAdmin} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-left text-purple-600 font-medium">
                                    <Settings size={16} /> {user.isAdmin ? 'Switch to Worker View' : 'Switch to Admin View'}
                                 </button>
                             )}

                             <div className="border-t border-gray-100 mt-2 pt-2">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-sm text-left"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </header>

        <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                youtubeLink={youtubeLink}
                telegramLink={telegramLink}
            />
            <main className="flex-1 overflow-y-auto bg-gray-100 p-2 md:p-4">
                <div className="max-w-4xl mx-auto h-full">
                    {renderContent()}
                </div>
            </main>
        </div>

        {/* Modals */}
        {showCategoryModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-fadeIn">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-semibold text-gray-700">Select Category</h3>
                        <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4 flex flex-wrap gap-2 max-h-[60vh] overflow-y-auto">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setShowCategoryModal(false);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                    selectedCategory === cat 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
                        <button 
                            onClick={() => {
                                setSelectedCategory('All');
                                setShowCategoryModal(false);
                            }}
                            className="px-4 py-2 text-xs font-bold text-white bg-gray-800 rounded hover:bg-gray-900"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showLocationModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-fadeIn">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-semibold text-gray-700">Select Location</h3>
                        <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                        {COUNTRIES.map(country => (
                            <button
                                key={country}
                                onClick={() => {
                                    setSelectedLocation(country);
                                    setShowLocationModal(false);
                                }}
                                className={`px-4 py-3 rounded text-left text-sm border transition-all flex justify-between items-center ${
                                    selectedLocation === country 
                                    ? 'bg-blue-50 text-blue-700 border-blue-500' 
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {country}
                                {selectedLocation === country && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
                         <button 
                            onClick={() => {
                                setSelectedLocation('International');
                                setShowLocationModal(false);
                            }}
                            className="px-4 py-2 text-xs font-bold text-white bg-gray-800 rounded hover:bg-gray-900"
                        >
                            Reset to International
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </HashRouter>
  );
};

export default App;