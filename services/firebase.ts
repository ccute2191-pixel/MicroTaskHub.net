import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, update, get, remove } from 'firebase/database';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';
import { Job, User, DepositSettings, AdSettings } from '../types';
import { MOCK_USER, INITIAL_JOBS } from '../constants';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAodc3vfau3J1e_IG73t0hOgzuL3gHUAyE",
  authDomain: "earning-31fb5.firebaseapp.com",
  databaseURL: "https://earning-31fb5-default-rtdb.firebaseio.com",
  projectId: "earning-31fb5",
  storageBucket: "earning-31fb5.firebasestorage.app",
  messagingSenderId: "974529547501",
  appId: "1:974529547501:web:bf3e45f7fecaf7a7a790e4"
};

// Initialize Firebase
let app;
let db: any;
let auth: any;

try {
  app = initializeApp(firebaseConfig);
  // Pass the URL explicitly to avoid config lookup issues
  db = getDatabase(app, "https://earning-31fb5-default-rtdb.firebaseio.com");
  auth = getAuth(app);
  
  // Enable persistence to keep user logged in across refreshes
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Firebase Auth Persistence enabled");
    })
    .catch((error) => {
        console.error("Auth Persistence Error:", error);
    });

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// --- Helper Functions ---

const handleSubscriptionError = (error: any, context: string, fallback?: any, callback?: any) => {
    // Check for various permission denied error formats
    const msg = error.message?.toLowerCase() || '';
    if (error.code === 'PERMISSION_DENIED' || msg.includes('permission_denied') || msg.includes('permission denied')) {
        console.warn(`Access denied for ${context}. Using offline/mock data.`);
    } else {
        console.error(`Error fetching ${context}:`, error);
    }
    if (callback && fallback) {
        callback(fallback);
    }
};

export const subscribeToJobs = (callback: (jobs: Job[]) => void) => {
  if (!db) {
      console.warn("Database not initialized, returning mock jobs.");
      callback(INITIAL_JOBS); // Fallback
      return () => {};
  }
  const jobsRef = ref(db, 'jobs');
  return onValue(jobsRef, (snapshot) => {
    const data = snapshot.val();
    const loadedJobs = data ? Object.values(data) : [];
    callback(loadedJobs as Job[]);
  }, (error) => handleSubscriptionError(error, 'jobs', INITIAL_JOBS, callback));
};

export const subscribeToUser = (userId: string, callback: (user: User) => void) => {
    if (!db) {
        callback(MOCK_USER);
        return () => {};
    }
    const userRef = ref(db, `users/${userId}`);
    return onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            callback(data);
        } else {
            // If user doesn't exist in DB yet, create them with initial data
            const initialUser = { ...MOCK_USER, id: userId };
            callback(initialUser);
        }
    }, (error) => handleSubscriptionError(error, 'user', MOCK_USER, callback));
};

export const subscribeToAllUsers = (callback: (users: User[]) => void) => {
    if(!db) return () => {};
    const usersRef = ref(db, 'users');
    return onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const loadedUsers = data ? Object.values(data) : [];
        callback(loadedUsers as User[]);
    }, (error) => handleSubscriptionError(error, 'all users', [], callback));
};

export const subscribeToDepositSettings = (callback: (settings: DepositSettings) => void) => {
    if(!db) return () => {};
    const settingsRef = ref(db, 'settings/deposit');
    return onValue(settingsRef, (snapshot) => {
        const data = snapshot.val();
        if(data) callback(data);
    }, (error) => handleSubscriptionError(error, 'deposit settings'));
};

export const subscribeToAdSettings = (callback: (settings: AdSettings) => void) => {
    if(!db) return () => {};
    const settingsRef = ref(db, 'settings/ads');
    return onValue(settingsRef, (snapshot) => {
        const data = snapshot.val();
        if(data) callback(data);
    }, (error) => handleSubscriptionError(error, 'ad settings'));
};

// --- Action Functions ---

export const addNewJob = async (job: Job) => {
    if(!db) return;
    try {
        const newJobRef = push(ref(db, 'jobs')); // Generate ID
        const jobWithId = { ...job, id: newJobRef.key };
        await set(newJobRef, jobWithId);
    } catch (e) {
        console.error("Error adding job:", e);
        throw e;
    }
};

export const deleteJob = async (jobId: string) => {
    if(!db) return;
    try {
        await set(ref(db, `jobs/${jobId}`), null);
    } catch (e) {
        console.error("Error deleting job:", e);
    }
};

// Overwriting the previous addNewJob for key consistency
export const createJobWithId = async (job: Job) => {
    if(!db) return;
    try {
        await set(ref(db, `jobs/${job.id}`), job);
    } catch (e) {
        console.error("Error creating job:", e);
    }
}

export const updateUserBalance = async (userId: string, earnings: number, deposit: number) => {
    if(!db) return;
    try {
        await update(ref(db, `users/${userId}`), { earnings, deposit });
    } catch (e) {
        console.error("Error updating balance:", e);
    }
};

export const updateUserStatus = async (userId: string, status: string) => {
    if(!db) return;
    try {
        await update(ref(db, `users/${userId}`), { status });
    } catch (e) {
        console.error("Error updating status:", e);
    }
}

export const sendBonusToUser = async (userId: string, bonusAmount: number) => {
    if (!db) return;
    const userRef = ref(db, `users/${userId}`);
    
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const currentEarnings = Number(userData.earnings) || 0;
            const newEarnings = currentEarnings + bonusAmount;
            
            await update(userRef, { 
                earnings: newEarnings 
            });
            return true;
        }
        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const updateJobProgress = async (jobId: string, completedCount: number) => {
    if(!db) return;
    try {
        await update(ref(db, `jobs/${jobId}`), { completedCount });
    } catch (e) {
        console.error("Error updating progress:", e);
    }
};

export const saveDepositSettings = async (settings: DepositSettings) => {
    if(!db) return;
    try {
        await set(ref(db, 'settings/deposit'), settings);
    } catch (e) {
        console.error("Error saving settings:", e);
    }
};

export const saveAdSettings = async (settings: AdSettings) => {
    if(!db) return;
    try {
        await set(ref(db, 'settings/ads'), settings);
    } catch (e) {
        console.error("Error saving ad settings:", e);
    }
};

// --- Auth Functions ---

export const loginWithGoogle = async () => {
    if (!auth) throw new Error("Firebase Auth not initialized.");
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const loginWithGithub = async () => {
    if (!auth) throw new Error("Firebase Auth not initialized.");
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
};

export const registerWithEmail = async (name: string, email: string, pass: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized.");
    
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        if(res.user) {
            await updateProfile(res.user, { displayName: name });
        }
        return res.user;
    } catch (error: any) {
        console.error("Registration Error Detail:", error);
        throw error;
    }
};

export const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized.");
    return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
    if (!auth) return;
    await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
    if (!auth) {
        callback(null);
        return () => {};
    }
    return onAuthStateChanged(auth, callback);
};

export const initializeUserInDb = async (firebaseUser: any) => {
    if (!firebaseUser) return null;
    
    // Fallback if DB is down but Auth works
    if (!db) {
        console.warn("DB not ready, returning temp user based on Auth");
        return {
            ...MOCK_USER,
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || MOCK_USER.avatar,
        } as User;
    }

    const userRef = ref(db, `users/${firebaseUser.uid}`);
    
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return snapshot.val() as User;
        } else {
            // New User Setup
            const email = firebaseUser.email || '';
            const isAdmin = email === 'ccute2191@gmail.com'; // Strict Admin Check

            const newUser: User = {
                ...MOCK_USER,
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New User',
                email: email,
                avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || firebaseUser.email || 'User'}&background=random`,
                joinedDate: new Date().toISOString().split('T')[0],
                isAdmin: isAdmin,
                earnings: 0.00,
                deposit: 0.00,
                verificationStatus: 'Unverified',
                membershipLevel: 'Free'
            };
            await set(userRef, newUser);
            return newUser;
        }
    } catch (error: any) {
        const msg = error.message?.toLowerCase() || '';
        if (error.code === 'PERMISSION_DENIED' || msg.includes('permission denied') || msg.includes('permission_denied')) {
            console.warn("Permission denied when init user in DB. Returning temp object.");
            return {
                ...MOCK_USER,
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Guest',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || MOCK_USER.avatar,
            };
        }
        console.error("Error initializing user in DB:", error);
        // Return a temporary user object so the app doesn't crash
        return {
            ...MOCK_USER,
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Error User',
        } as User;
    }
};