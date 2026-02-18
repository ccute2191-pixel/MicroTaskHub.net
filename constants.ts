
import { Job, JobCategory, User, JobSubmission } from './types';

export const MOCK_USER: User = {
  id: '184135',
  name: 'Tohin Ahmed',
  earnings: 0.325,
  deposit: 0.005,
  avatar: 'https://ui-avatars.com/api/?name=Tohin+Ahmed&background=0D8ABC&color=fff',
  isAdmin: true, // Set to TRUE so Admin Panel is accessible in Demo Mode
  email: 'ccute2191@gmail.com', // Updated to match strict Admin email
  country: 'Bangladesh',
  phone: '+880 1712 345678',
  joinedDate: '2023-09-12',
  bio: 'Hardworking freelancer looking for micro tasks.',
  status: 'Active',
  verificationStatus: 'Unverified',
  membershipLevel: 'Free'
};

export const COUNTRIES = [
  'International',
  'USA',
  'UK',
  'Canada',
  'Bangladesh',
  'India',
  'Pakistan',
  'Philippines',
  'Nigeria',
  'Brazil',
  'Germany',
  'Australia',
  'Vietnam',
  'Indonesia'
];

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Simple sign up job',
    category: JobCategory.SIGNUP,
    payout: 0.100,
    completedCount: 497,
    maxCount: 510,
    isTopJob: true,
    targetCountry: 'International'
  },
  {
    id: '2',
    title: 'YouTube video watch',
    category: JobCategory.YOUTUBE,
    payout: 0.029,
    completedCount: 3312,
    maxCount: 3403,
    isTopJob: true,
    targetCountry: 'International'
  },
  {
    id: '3',
    title: 'Data Entry: Excel Sheet',
    category: JobCategory.DATA_ENTRY,
    payout: 0.500,
    completedCount: 12,
    maxCount: 50,
    isTopJob: true,
    targetCountry: 'International'
  },
  {
    id: '4',
    title: 'Logo Design for Startup',
    category: JobCategory.GRAPHICS_DESIGN,
    payout: 5.000,
    completedCount: 2,
    maxCount: 5,
    isTopJob: true,
    targetCountry: 'International'
  },
  {
    id: '5',
    title: 'Short Link Click & View',
    category: JobCategory.SHORT_LINK,
    payout: 0.015,
    completedCount: 5300,
    maxCount: 6000,
    isTopJob: false,
    targetCountry: 'International'
  },
  {
    id: '6',
    title: 'Post Ad on Facebook Group',
    category: JobCategory.ADS_POST,
    payout: 0.050,
    completedCount: 150,
    maxCount: 300,
    isTopJob: false,
    targetCountry: 'USA'
  },
  {
    id: '7',
    title: 'Rewatch video 📺',
    category: JobCategory.YOUTUBE,
    payout: 0.028,
    completedCount: 727,
    maxCount: 1061,
    isTopJob: true,
    targetCountry: 'USA'
  },
  {
    id: '8',
    title: 'Fast payment job 💰',
    category: JobCategory.OTHER,
    payout: 0.025,
    completedCount: 646,
    maxCount: 1225,
    isTopJob: true,
    targetCountry: 'International'
  }
];

export const CATEGORIES = [
  'All',
  'YouTube',
  'Facebook',
  'Instagram',
  'Sign Up',
  'Ads Post',
  'Data Entry',
  'Graphics Design',
  'Short Link',
  'Application',
  'Telegram',
  'Search / Click',
  'Promotion',
  'Mobile Application',
  'Share',
  'Gmail Account',
  'Comment',
  'TikTok'
];

export const MOCK_SUBMISSIONS: JobSubmission[] = [
  {
    id: 'sub-1',
    jobId: '1',
    workerId: '998877',
    workerName: 'Sarah Connor',
    proofText: 'I signed up using your link. My username is sarah_c123. Email is sarah@test.com.',
    proofImage: 'https://images.unsplash.com/photo-1481487484168-9b930d55206d?auto=format&fit=crop&q=80&w=300&h=200',
    status: 'Pending',
    submittedDate: '2023-10-27 14:30'
  },
  {
    id: 'sub-2',
    jobId: '1',
    workerId: '554433',
    workerName: 'John Wick',
    proofText: 'Done. Please check attached screenshot of welcome email.',
    proofImage: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=300&h=200',
    status: 'Pending',
    submittedDate: '2023-10-27 15:15'
  },
  {
    id: 'sub-3',
    jobId: '2',
    workerId: '112233',
    workerName: 'Alice Wonderland',
    proofText: 'Watched full video and liked. Commented as AliceW.',
    status: 'Approved',
    submittedDate: '2023-10-26 09:00'
  }
];
