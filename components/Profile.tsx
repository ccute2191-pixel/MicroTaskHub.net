import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Calendar, MapPin, Shield, Edit3, Camera, Save, ShieldCheck, Upload, X, Check } from 'lucide-react';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'Unverified' | 'Pending' | 'Verified' | 'Rejected'>(user.verificationStatus || 'Unverified');
  const [selectedDoc, setSelectedDoc] = useState('National ID');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if(!previewImage) {
        alert("Please upload a photo.");
        return;
    }
    // Simulate API call
    setTimeout(() => {
        setVerificationStatus('Pending');
        setShowVerifyModal(false);
        alert("Verification submitted successfully! Please wait for admin approval.");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
             <div className="relative group">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                />
                <button className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Camera size={14} />
                </button>
             </div>
             <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 shadow-sm flex items-center gap-2">
                <Edit3 size={14} /> Edit Profile
             </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                  user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {user.isAdmin ? 'Administrator' : 'Worker'}
              </span>
              <span>•</span>
              <span className="text-gray-400">ID: {user.id}</span>
              {verificationStatus === 'Verified' && (
                  <span className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      <ShieldCheck size={12} /> Verified
                  </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Personal Info</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                   <Mail className="text-gray-400 mt-0.5" size={16} />
                   <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="font-medium text-gray-800">tohin.ahmed@example.com</p>
                   </div>
                </li>
                <li className="flex items-start gap-3">
                   <MapPin className="text-gray-400 mt-0.5" size={16} />
                   <div>
                      <p className="text-gray-500 text-xs">Location</p>
                      <p className="font-medium text-gray-800">Dhaka, Bangladesh</p>
                   </div>
                </li>
                <li className="flex items-start gap-3">
                   <Calendar className="text-gray-400 mt-0.5" size={16} />
                   <div>
                      <p className="text-gray-500 text-xs">Joined</p>
                      <p className="font-medium text-gray-800">September 2023</p>
                   </div>
                </li>
              </ul>
           </div>

           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Security & Verification</h3>
              <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield size={16} className="text-green-500" /> Email Verified
                    </div>
                    <span className="text-xs text-green-600 font-bold">Yes</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShieldCheck size={16} className={verificationStatus === 'Verified' ? "text-green-500" : "text-gray-400"} /> Identity
                    </div>
                    <span className={`text-xs font-bold ${
                        verificationStatus === 'Verified' ? 'text-green-600' : 
                        verificationStatus === 'Pending' ? 'text-yellow-600' : 'text-red-500'
                    }`}>
                        {verificationStatus}
                    </span>
                  </div>
                  
                  {verificationStatus === 'Unverified' && (
                     <button 
                        onClick={() => setShowVerifyModal(true)}
                        className="w-full py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
                     >
                        Verify Identity Now
                     </button>
                  )}
                  
                  {verificationStatus === 'Pending' && (
                     <div className="text-xs text-center text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-100">
                         Verification pending approval.
                     </div>
                  )}
              </div>
              
              <button className="w-full mt-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-50">
                Change Password
              </button>
           </div>
        </div>

        {/* Main Stats Area */}
        <div className="md:col-span-2 space-y-6">
           {/* Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                 <p className="text-3xl font-bold text-blue-600">${user.earnings.toFixed(3)}</p>
                 <p className="text-xs text-gray-500 uppercase font-semibold mt-1">Total Earnings</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                 <p className="text-3xl font-bold text-green-600">142</p>
                 <p className="text-xs text-gray-500 uppercase font-semibold mt-1">Tasks Completed</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                 <p className="text-3xl font-bold text-purple-600">98%</p>
                 <p className="text-xs text-gray-500 uppercase font-semibold mt-1">Success Rate</p>
              </div>
           </div>

           {/* Recent Activity in Profile */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Account Overview</h3>
              <form className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input type="text" defaultValue="Tohin" className="w-full p-2 border rounded bg-gray-50 text-gray-600 text-sm" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input type="text" defaultValue="Ahmed" className="w-full p-2 border rounded bg-gray-50 text-gray-600 text-sm" readOnly />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea className="w-full p-2 border rounded bg-white text-gray-800 text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Write something about yourself..."></textarea>
                 </div>
                 <div className="flex justify-end">
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 flex items-center gap-2">
                        <Save size={16} /> Save Changes
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                      <h3 className="font-bold flex items-center gap-2">
                          <ShieldCheck size={20} /> Identity Verification
                      </h3>
                      <button onClick={() => setShowVerifyModal(false)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmitVerification} className="p-6">
                      <p className="text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded border border-blue-100">
                          To verify your account, please upload a <strong className="text-blue-700">Selfie holding your ID Document</strong>. 
                          The face and document details must be clearly visible.
                      </p>

                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                              <select 
                                value={selectedDoc}
                                onChange={(e) => setSelectedDoc(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                              >
                                  <option>National ID Card (NID)</option>
                                  <option>Driving License</option>
                                  <option>Passport</option>
                                  <option>Other Government ID</option>
                              </select>
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Proof (Selfie with ID)</label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  {previewImage ? (
                                      <div className="relative">
                                          <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded shadow-sm" />
                                          <p className="text-xs text-green-600 mt-2 font-bold flex items-center justify-center gap-1">
                                              <Check size={12} /> Image Selected
                                          </p>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center justify-center text-gray-400">
                                          <Camera size={32} className="mb-2" />
                                          <p className="text-sm font-medium">Tap to Take Photo or Upload</p>
                                          <p className="text-xs mt-1">Supports JPG, PNG (Max 5MB)</p>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      <div className="mt-8 flex gap-3">
                          <button 
                            type="button"
                            onClick={() => setShowVerifyModal(false)}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit"
                            className="flex-1 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 shadow-md"
                          >
                              Submit Verification
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Profile;