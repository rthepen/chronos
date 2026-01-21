import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TimelineItem as TimelineItemType } from '../../types/chronos';

interface Props {
    item: TimelineItemType;
    isActive: boolean;
    isPast: boolean;
}

export const TimelineItem: React.FC<Props> = ({ item, isActive, isPast }) => {
    // 1. Determine Color Scheme based on Type
    const getColors = (type: string) => {
        switch (type) {
            case 'WORK': return 'border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.3)]';
            case 'REST': return 'border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF]';
            case 'PREPARE': return 'border-orange-500 bg-orange-500/10 text-orange-500';
            case 'ROUND_REST': return 'border-purple-500 bg-purple-500/10 text-purple-500';
            case 'FINISH': return 'border-yellow-400 bg-yellow-400/10 text-yellow-400';
            default: return 'border-slate-700 bg-slate-800 text-slate-400';
        }
    };

    const colorClasses = getColors(item.type);

    // 2. Base Height & Layout
    const baseClasses = "relative w-full mb-2 p-4 border-l-4 rounded-r-md transition-all duration-300 flex items-center justify-between";
    const stateClasses = isActive
        ? `scale-105 z-10 ${colorClasses} opacity-100`
        : isPast
            ? "opacity-30 border-slate-700 grayscale"
            : "opacity-60 border-slate-700 hover:opacity-80";

    return (
        <div
            className={twMerge(baseClasses, stateClasses)}
            style={{ minHeight: isActive ? '120px' : '80px' }}
        >
            {/* Progress Bar Background (Fill) */}
            {isActive && (
                <div
                    className="absolute inset-0 z-0 bg-current opacity-20 origin-left transition-transform duration-75 ease-linear"
                    style={{ transform: `scaleX(${item.progress || 0})` }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                    {item.type.replace('_', ' ')}
                </span>
                <span className="text-lg font-bold md:text-xl truncate max-w-[250px]">
                    {item.label}
                </span>
            </div>

            {/* Duration */}
            <div className="relative z-10 text-2xl font-mono tabular-nums font-bold">
                {Math.ceil(item.durationMs / 1000)}s
            </div>
        </div>
    );
};
