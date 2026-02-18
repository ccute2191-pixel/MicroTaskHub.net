import React, { useState, useEffect } from 'react';
import { loginWithGoogle, loginWithGithub, loginWithEmail, registerWithEmail } from '../services/firebase';
import { Github, AlertCircle, Eye, ArrowRight, Mail, Lock, User, Loader2, TrendingUp, DollarSign, CheckCircle2, Users } from 'lucide-react';
import { Logo } from './Logo';

interface LoginProps {
    onDemoLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onDemoLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveUsers, setLiveUsers] = useState(4821);
  
  // Fake ticker data
  const [payouts, setPayouts] = useState<string[]>([]);

  useEffect(() => {
      const names = ['Sarah', 'John', 'Mike', 'Alex', 'Emily', 'David', 'Lisa', 'Robert', 'Jessica'];
      const actions = ['withdrew', 'earned'];
      const tasks = ['watching video', 'clicking ad', 'installing app', 'data entry'];
      
      const interval = setInterval(() => {
          const name = names[Math.floor(Math.random() * names.length)];
          const action = actions[Math.floor(Math.random() * actions.length)];
          const amount = (Math.random() * 5).toFixed(3);
          const task = tasks[Math.floor(Math.random() * tasks.length)];
          const msg = action === 'earned' 
            ? `${name} earned $${amount} from ${task}`
            : `${name} withdrew $${amount} to PayPal`;
            
          setPayouts(prev => [msg, ...prev.slice(0, 3)]);
      }, 2500);
      
      const userInterval = setInterval(() => {
          setLiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      }, 5000);

      return () => {
          clearInterval(interval);
          clearInterval(userInterval);
      };
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
          if (isRegistering) {
              if (!name) throw new Error("Please enter your name.");
              await registerWithEmail(name, email, password);
          } else {
              await loginWithEmail(email, password);
          }
      } catch (err: any) {
          console.error("Auth Error:", err);
          let msg = err.message;
          if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
          if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
          if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
          if (err.code === 'auth/quota-exceeded') msg = 'Signup limit reached for today (Server Quota). Please use Demo Mode or try again tomorrow.';
          if (err.code === 'auth/too-many-requests') msg = 'Too many failed attempts. Please try again later.';
          if (err.code === 'auth/network-request-failed') msg = 'Network error. Please check your internet connection.';
          setError(msg);
      } finally {
          setLoading(false);
      }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Google Login Error:", err);
      let msg = err.message || "Failed to sign in with Google.";
      
      if (err.code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
          // Auto-fallback to Demo Mode for smoother user experience in preview environments
          onDemoLogin();
          alert("Notice: This preview domain is not authorized for Google Sign-In. You have been logged in to Demo Mode automatically.");
          setLoading(false);
          return;
      } else if (err.code === 'auth/popup-closed-by-user') {
          msg = "Sign in cancelled.";
      } else if (err.code === 'auth/configuration-not-found') {
          msg = "Google Sign-In is not enabled in Firebase Console.";
      } else if (err.code === 'auth/quota-exceeded') {
          msg = "System usage limit exceeded. Please try again later or use Demo Mode.";
      } else if (err.code === 'auth/network-request-failed') {
          msg = "Network connection failed. Please check your internet.";
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGithub();
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "Failed to sign in with GitHub.";
       if (err.code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
          onDemoLogin();
          alert("Notice: This preview domain is not authorized for GitHub Sign-In. You have been logged in to Demo Mode automatically.");
          setLoading(false);
          return;
      } else if (err.code === 'auth/popup-closed-by-user') {
          msg = "Sign in cancelled.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 font-sans">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full min-h-[600px] animate-fadeIn">
            
            {/* Left Side - Promotional/Realtime Info */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Background Design */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-purple-500 opacity-10 rounded-full blur-2xl"></div>
                
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>

                <div className="relative z-10">
                     <Logo className="text-white [&_span]:text-white [&_svg]:text-white [&_.bg-white]:bg-blue-600 [&_.text-green-500]:text-green-400" />
                     <h2 className="text-4xl font-extrabold mt-8 mb-4 leading-tight tracking-tight">
                        Earn Money Online <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">Real Time.</span>
                     </h2>
                     <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Join over <span className="font-bold text-white">50,000+</span> workers completing simple tasks. Get paid instantly for watching videos, likes, and more.
                     </p>
                     
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="bg-green-500/20 p-2 rounded-lg">
                                <CheckCircle2 className="text-green-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">Instant Payouts</p>
                                <p className="text-xs text-blue-200">PayPal, Crypto, Bank Transfer, bKash</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="bg-yellow-500/20 p-2 rounded-lg">
                                <TrendingUp className="text-yellow-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">Unlimited Tasks</p>
                                <p className="text-xs text-blue-200">100+ new jobs posted every hour</p>
                            </div>
                        </div>
                     </div>
                </div>

                {/* Real-time Ticker & Stats */}
                <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-2">
                             <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-green-300">Live Activity</span>
                         </div>
                         <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded-full border border-white/10">
                             <Users size={12} className="text-blue-300" />
                             <span className="text-xs font-mono font-bold">{liveUsers.toLocaleString()} online</span>
                         </div>
                    </div>
                    
                    <div className="space-y-2.5 max-h-32 overflow-hidden mask-linear-fade">
                        {payouts.map((p, i) => (
                            <div key={i} className="bg-black/20 p-2.5 rounded-lg flex items-center gap-3 text-sm animate-fadeIn border border-white/5 hover:bg-black/30 transition-colors">
                                <div className={`p-1 rounded-full ${p.includes('withdrew') ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                                    <DollarSign size={12} />
                                </div>
                                <span className="truncate">{p}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                <div className="max-w-md mx-auto w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-500">
                            {isRegistering ? 'Start your earning journey today' : 'Log in to access your dashboard'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fadeIn">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <div className="text-sm text-red-700 font-medium break-words">{error}</div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-5 mb-6">
                        {isRegistering && (
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all font-medium"
                                    required
                                />
                            </div>
                        )}
                        
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input 
                                type="email" 
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all font-medium"
                                required
                                minLength={6}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 flex justify-center items-center gap-2 text-base active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                isRegistering ? 'Start Earning Now' : 'Sign In to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-500 mb-8">
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"} {' '}
                        <button 
                            type="button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError(null);
                            }}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            {isRegistering ? 'Log In Here' : 'Create Free Account'}
                        </button>
                    </div>

                    <div className="relative py-2 mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider">
                            <span className="bg-white px-3 text-gray-400 font-semibold">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button 
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold py-3 rounded-xl hover:bg-gray-50 transition-all hover:shadow-md hover:border-gray-300"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>

                        <button 
                            type="button"
                            onClick={handleGithubLogin}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-[#24292e] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#2f363d] transition-all hover:shadow-md"
                        >
                            <Github size={20} />
                            GitHub
                        </button>
                    </div>

                    <button 
                        type="button"
                        onClick={onDemoLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md group text-sm"
                    >
                        <Eye size={18} className="group-hover:scale-110 transition-transform" />
                        Try Demo Mode (No Login)
                        <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;