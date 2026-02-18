
export enum JobCategory {
  YOUTUBE = 'YouTube',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  SIGNUP = 'Sign Up',
  TELEGRAM = 'Telegram',
  ADS_POST = 'Ads Post',
  DATA_ENTRY = 'Data Entry',
  GRAPHICS_DESIGN = 'Graphics Design',
  SHORT_LINK = 'Short Link',
  APPLICATION = 'Application',
  OTHER = 'Other'
}

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  payout: number;
  completedCount: number;
  maxCount: number;
  isTopJob: boolean;
  thumbnail?: string; // Optional icon/image
  instructions?: string;
  targetCountry: string;
}

export interface User {
  id: string;
  name: string;
  earnings: number;
  deposit: number;
  avatar: string;
  isAdmin: boolean;
  email?: string;
  status?: 'Active' | 'Banned';
  joinedDate?: string;
  bio?: string;
  country?: string;
  phone?: string;
  age?: number;
  gender?: string;
  verificationStatus?: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  membershipLevel: 'Free' | 'Silver' | 'Gold';
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  accountDetails: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'Open' | 'Closed' | 'Replied';
  date: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  documentType: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  date: string;
  imageUrl?: string;
}

export interface Deposit {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  accountDetails?: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface JobSubmission {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  proofText: string;
  proofImage?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export interface DepositSettings {
  paypal: string;
  zelle: string;
  bank: string;
  visa: string;
  bikash: string;
}

export interface AdSettings {
  isEnabled: boolean;
  bannerImageUrl: string;
  bannerTargetUrl: string;
  directLinkUrl: string;
  directLinkText: string;
}