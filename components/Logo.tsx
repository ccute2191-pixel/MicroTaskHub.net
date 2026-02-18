
import React from 'react';
import { Settings, Check } from 'lucide-react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative flex items-center justify-center w-8 h-8">
            <Settings className="text-blue-600 w-full h-full" strokeWidth={2.5} />
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white rounded-full p-0.5 shadow-sm">
                    <Check className="text-green-500 w-4 h-4" strokeWidth={4} />
                 </div>
            </div>
        </div>
        <span className="text-xl font-bold tracking-tight select-none">
            <span className="text-blue-600">Micro</span>
            <span className="text-green-500">TaskHub</span>
        </span>
    </div>
);
