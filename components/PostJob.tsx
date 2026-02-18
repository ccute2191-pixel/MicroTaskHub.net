import React, { useState, useEffect } from 'react';
import { Job, JobCategory } from '../types';
import { generateJobDescription } from '../services/geminiService';
import { Sparkles, Send, AlertCircle, MapPin, Palette } from 'lucide-react';
import { COUNTRIES } from '../constants';

interface PostJobProps {
  onPost: (job: Job) => void;
  onCancel: () => void;
}

const PostJob: React.FC<PostJobProps> = ({ onPost, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(JobCategory.YOUTUBE);
  const [payout, setPayout] = useState(0.020);
  const [quantity, setQuantity] = useState(100);
  const [description, setDescription] = useState('');
  const [targetCountry, setTargetCountry] = useState('International');
  const [isGenerating, setIsGenerating] = useState(false);
  const [graphicSubType, setGraphicSubType] = useState('Logo Design');

  // Enforce minimum price for Application category
  useEffect(() => {
    if (category === JobCategory.APPLICATION) {
        if (payout < 0.08) setPayout(0.08);
    }
  }, [category]);

  const handleGenerateDesc = async () => {
    if (!title) {
        alert("Please enter a title first");
        return;
    }
    setIsGenerating(true);
    const desc = await generateJobDescription(title);
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for Application category min price
    if (category === JobCategory.APPLICATION && payout < 0.08) {
        alert("The minimum payout for Application jobs is $0.08");
        return;
    }

    let finalTitle = title;
    if (category === JobCategory.GRAPHICS_DESIGN) {
        finalTitle = `${graphicSubType}: ${title}`;
    }

    const newJob: Job = {
        id: Math.random().toString(36).substr(2, 9),
        title: finalTitle,
        category,
        payout,
        completedCount: 0,
        maxCount: quantity,
        isTopJob: false,
        instructions: description,
        targetCountry
    };
    onPost(newJob);
  };

  const minPayout = category === JobCategory.APPLICATION ? 0.08 : 0.01;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Send className="text-blue-600" /> Post New Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Download and Review this App"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as JobCategory)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {Object.values(JobCategory).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Target Location</label>
                     <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                        <select 
                            value={targetCountry}
                            onChange={(e) => setTargetCountry(e.target.value)}
                            className="w-full p-2 pl-9 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {COUNTRIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                     </div>
                </div>
            </div>

            {/* Graphics Design Sub-Category Selector */}
            {category === JobCategory.GRAPHICS_DESIGN && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 animate-fadeIn">
                    <label className="block text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                        <Palette size={16} /> Select Design Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['Logo', 'Poster', 'Thumbnail', 'Banner Art', 'Other'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setGraphicSubType(type + (type === 'Other' ? '' : ' Design'))}
                                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    graphicSubType.startsWith(type)
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-purple-200 hover:bg-purple-100'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-purple-600 mt-2">
                        Selected: <strong>{graphicSubType}</strong>. This will be prefixed to your job title.
                    </p>
                </div>
            )}

            {category === JobCategory.SHORT_LINK && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                    <strong>Tip:</strong> Short Link jobs are great for quick traffic. Ensure your link is safe and follows community guidelines.
                </div>
            )}

            {category === JobCategory.APPLICATION && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-xs text-green-800">
                    <strong>Note:</strong> Application jobs require a minimum payout of <strong>$0.08</strong> per worker to ensure quality installations.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Workers Needed</label>
                    <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="10"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payout per Worker ($)</label>
                    <input 
                        type="number" 
                        step="0.001"
                        value={payout}
                        onChange={(e) => setPayout(Number(e.target.value))}
                        min={minPayout}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total cost: ${(payout * quantity).toFixed(2)}</p>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Instructions / Description</label>
                    <button 
                        type="button"
                        onClick={handleGenerateDesc}
                        disabled={isGenerating}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold"
                    >
                        <Sparkles size={14} />
                        {isGenerating ? 'Generating...' : 'Auto-Generate with AI'}
                    </button>
                </div>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Describe what the worker needs to do..."
                ></textarea>
            </div>

            <div className="bg-blue-50 p-3 rounded flex items-start gap-2 text-sm text-blue-800">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>Jobs are reviewed by admins before going live. Please ensure your job follows our community guidelines.</p>
            </div>

            <div className="flex gap-3 pt-4">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-sm"
                >
                    Post Job Now
                </button>
            </div>
        </form>
    </div>
  );
};

export default PostJob;