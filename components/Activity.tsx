import React, { useState } from 'react';
import { Job, JobSubmission } from '../types';
import { Briefcase, Clock, CheckCircle, ChevronRight, ArrowLeft, Image as ImageIcon, Check, X, ExternalLink, AlertCircle } from 'lucide-react';
import { MOCK_SUBMISSIONS } from '../constants';

interface ActivityProps {
  view: 'my-work' | 'my-jobs';
  jobs: Job[];
}

const Activity: React.FC<ActivityProps> = ({ view, jobs }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [submissions, setSubmissions] = useState<JobSubmission[]>(MOCK_SUBMISSIONS);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Filter submissions for the selected job
  const activeSubmissions = selectedJob 
    ? submissions.filter(s => s.jobId === '1' || s.jobId === selectedJob.id) // Mocking logic: showing mock subs for any job for demo
    : [];

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action } : s));
  };

  if (view === 'my-work') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-fadeIn">
        <div className="p-4 border-b border-gray-100">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" /> Task History
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-3">Task ID</th>
                        <th className="px-4 py-3">Job Title</th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Earned</th>
                        <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[1,2,3,4,5].map((i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500">#{1000 + i}</td>
                            <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-[200px]">
                                {i % 2 === 0 ? 'YouTube Video Watch' : 'Signup for Binance'}
                            </td>
                            <td className="px-4 py-3 text-gray-500">Oct {20 + i}, 2023</td>
                            <td className="px-4 py-3 text-green-600 font-bold">
                                ${i % 2 === 0 ? '0.025' : '0.100'}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    i === 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>
                                    {i === 1 ? 'Pending' : 'Approved'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
  }

  // --- MY JOBS & PROOFS VIEW ---
  
  // 1. Detailed Proof Review View
  if (selectedJob) {
      return (
          <div className="space-y-4 animate-fadeIn">
              <button 
                onClick={() => setSelectedJob(null)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                  <ArrowLeft size={16} /> Back to My Jobs
              </button>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                  <div>
                      <h2 className="font-bold text-gray-800">{selectedJob.title}</h2>
                      <div className="flex gap-4 mt-1 text-sm text-gray-500">
                          <span>Category: {selectedJob.category}</span>
                          <span>Pays: <b className="text-green-600">${selectedJob.payout}</b></span>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase">Progress</p>
                      <p className="font-bold text-blue-600">{selectedJob.completedCount} / {selectedJob.maxCount}</p>
                  </div>
              </div>

              <h3 className="font-bold text-gray-700 mt-6 flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500"/> 
                  Review Proofs ({activeSubmissions.filter(s => s.status === 'Pending').length} Pending)
              </h3>

              <div className="space-y-4">
                  {activeSubmissions.length > 0 ? (
                      activeSubmissions.map(sub => (
                          <div key={sub.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative overflow-hidden">
                              {sub.status !== 'Pending' && (
                                  <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase rounded-bl-lg ${
                                      sub.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                      {sub.status}
                                  </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                          {sub.workerName.substring(0,2).toUpperCase()}
                                      </div>
                                      <div>
                                          <p className="font-bold text-sm text-gray-800">{sub.workerName}</p>
                                          <p className="text-xs text-gray-500">User ID: {sub.workerId} • {sub.submittedDate}</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mb-3">
                                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Text Proof:</p>
                                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{sub.proofText}</p>
                              </div>

                              {sub.proofImage && (
                                  <div className="mb-4">
                                      <p className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-1">
                                          <ImageIcon size={12} /> Screenshot Proof:
                                      </p>
                                      <div className="relative group inline-block">
                                          <img 
                                              src={sub.proofImage} 
                                              alt="Proof" 
                                              className="h-32 w-auto rounded border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                              onClick={() => setExpandedImage(sub.proofImage!)}
                                          />
                                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all cursor-pointer rounded pointer-events-none"></div>
                                      </div>
                                  </div>
                              )}

                              {sub.status === 'Pending' && (
                                  <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                                      <button 
                                          onClick={() => handleAction(sub.id, 'Approved')}
                                          className="flex-1 bg-green-600 text-white py-2 rounded text-sm font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                                      >
                                          <Check size={16} /> Approve
                                      </button>
                                      <button 
                                          onClick={() => handleAction(sub.id, 'Rejected')}
                                          className="flex-1 bg-white text-red-600 border border-red-200 py-2 rounded text-sm font-bold hover:bg-red-50 flex items-center justify-center gap-2"
                                      >
                                          <X size={16} /> Reject
                                      </button>
                                  </div>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                          <AlertCircle size={32} className="mx-auto text-gray-300 mb-2" />
                          <p className="text-gray-500">No submissions found for this job yet.</p>
                      </div>
                  )}
              </div>

              {/* Image Modal */}
              {expandedImage && (
                  <div className="fixed inset-0 z-[70] bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setExpandedImage(null)}>
                      <button className="absolute top-4 right-4 text-white hover:text-gray-300"><X size={32} /></button>
                      <img src={expandedImage} className="max-w-full max-h-[90vh] rounded shadow-2xl" alt="Full Proof" />
                  </div>
              )}
          </div>
      );
  }

  // 2. Main "My Jobs" List View
  return (
    <div className="space-y-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-2">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-500" /> Jobs You Posted
            </h3>
            <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors">
                + Post New
            </button>
        </div>
        
        {jobs.slice(0, 4).map(job => (
            <div 
                key={job.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedJob(job)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">ID: {job.id}</span>
                            <span>{job.category}</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <div className="mt-4 flex items-end justify-between">
                    <div className="flex-1 pr-4">
                         <div className="flex justify-between text-xs mb-1">
                             <span className="font-semibold text-gray-600">Progress</span>
                             <span className="text-blue-600 font-bold">{job.completedCount}/{job.maxCount}</span>
                         </div>
                         <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                             <div 
                                className="bg-blue-500 h-full rounded-full" 
                                style={{width: `${(job.completedCount/job.maxCount)*100}%`}}
                             ></div>
                         </div>
                    </div>
                    <div className="flex gap-2">
                         <div className="text-center px-3 py-1 bg-yellow-50 border border-yellow-100 rounded">
                             <span className="block text-lg font-bold text-yellow-600 leading-none">2</span>
                             <span className="text-[10px] text-yellow-700 font-bold uppercase">Pending</span>
                         </div>
                    </div>
                </div>
            </div>
        ))}

        {jobs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Briefcase size={32} />
                 </div>
                 <h4 className="text-lg font-bold text-gray-800">No Jobs Posted Yet</h4>
                 <p className="text-gray-500 text-sm mt-1 mb-6">You haven't posted any jobs for workers yet.</p>
                 <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Post Your First Job
                 </button>
            </div>
        )}
    </div>
  );
};

export default Activity;