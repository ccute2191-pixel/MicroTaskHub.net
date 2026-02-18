import React, { useState } from 'react';
import { Job } from '../types';
import { CheckCircle2, Heart, PlayCircle, Star, Bot, Globe } from 'lucide-react';
import { getJobAssistance } from '../services/geminiService';

interface JobCardProps {
  job: Job;
  onWork: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onWork }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [aiHelp, setAiHelp] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleWork = () => {
    setIsWorking(true);
    // Simulate API call
    setTimeout(() => {
      onWork(job);
      setIsWorking(false);
    }, 1500);
  };

  const handleAiHelp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiHelp) {
        setAiHelp(null);
        return;
    }
    setLoadingAi(true);
    const helpText = await getJobAssistance(job.title);
    setAiHelp(helpText);
    setLoadingAi(false);
  };

  const progress = (job.completedCount / job.maxCount) * 100;

  // Determine Icon based on category (simple logic for demo)
  const renderIcon = () => {
    if (job.category.toLowerCase().includes('youtube')) return <PlayCircle className="text-red-500 w-5 h-5" />;
    if (job.title.toLowerCase().includes('sign up')) return <CheckCircle2 className="text-green-500 w-5 h-5" />;
    if (job.title.toLowerCase().includes('like')) return <Heart className="text-pink-500 w-5 h-5" />;
    return <Star className="text-yellow-500 w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
            {/* Thumbnail/Icon placeholder */}
            <div className="mt-1">
                {renderIcon()}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                    {job.isTopJob && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded border border-green-200 uppercase tracking-wide">
                            Top Job
                        </span>
                    )}
                    <span className="text-[10px] text-gray-500">{job.category}</span>
                    <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        <Globe size={10} /> {job.targetCountry}
                    </span>
                </div>
            </div>
        </div>
        <div className="text-right flex flex-col items-end">
            <span className="text-sm font-bold text-green-600">{job.payout.toFixed(3)} $</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-semibold uppercase tracking-wider">
            <span>Progress</span>
            <span>{job.completedCount} OF {job.maxCount}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-3 flex gap-2">
        <button 
            onClick={handleWork}
            disabled={isWorking}
            className={`flex-1 py-1.5 rounded text-xs font-semibold text-white transition-colors ${
                isWorking ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
            {isWorking ? 'Verifying...' : 'Apply Now'}
        </button>
        <button
            onClick={handleAiHelp}
            className="px-3 py-1.5 rounded border border-purple-200 text-purple-600 hover:bg-purple-50 flex items-center gap-1 text-xs"
            title="Ask AI for help"
        >
            <Bot size={14} />
            {loadingAi ? 'Asking...' : 'AI Help'}
        </button>
      </div>

      {/* AI Assistance Box */}
      {aiHelp && (
          <div className="mt-3 p-3 bg-purple-50 rounded text-xs text-purple-800 border border-purple-100 animate-fadeIn">
              <strong className="block mb-1">Gemini Assistant:</strong>
              {aiHelp}
          </div>
      )}
    </div>
  );
};

export default JobCard;