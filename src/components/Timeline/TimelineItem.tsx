import React from 'react';
import clsx from 'clsx';
import type { TimelineItem as TimelineItemType } from '../../types/chronos';

interface Props {
    item: TimelineItemType;
    isActive?: boolean;
    isPast?: boolean;
    progress?: number; // 0 to 1
}

export const TimelineItem: React.FC<Props> = ({ item, isActive, isPast, progress = 0 }) => {
    return (
        <div
            className={clsx(
                "relative w-full h-16 mb-2 rounded-lg overflow-hidden flex items-center px-4 transition-all duration-75 ease-linear",
                // Active: Bright, scaled up slightly
                isActive && "scale-105 shadow-xl border border-slate-700 z-10",
                isActive && item.type === 'WORK' && "bg-slate-800",
                isActive && item.type !== 'WORK' && "bg-slate-900", // Darker for rest

                // Past: Dimmed significantly
                isPast && "opacity-30 grayscale",

                // Future: Standard opacity
                !isActive && !isPast && "bg-slate-900/50 opacity-60",

                // Type-Specific Border/Glow for Active/Future
                item.type === 'WORK' && !isPast && "border-l-4 border-l-nano-green",
                (item.type === 'REST') && !isPast && "border-l-4 border-l-nano-blue",
                (item.type === 'PREPARE' || item.type === 'ROUND_REST') && !isPast && "border-l-4 border-l-nano-orange",
                item.type === 'FINISH' && !isPast && "border-l-4 border-l-yellow-400"
            )}
        >
            {/* Progress Fill */}
            <div
                className={clsx(
                    "absolute top-0 left-0 h-full opacity-30 transition-none", // transition-none for instant updates
                    item.type === 'WORK' && "bg-nano-green",
                    (item.type === 'REST') && "bg-nano-blue",
                    (item.type === 'PREPARE' || item.type === 'ROUND_REST') && "bg-nano-orange",
                    item.type === 'FINISH' && "bg-yellow-400"
                )}
                style={{ width: `${progress * 100}%` }}
            />

            {/* Content */}
            <div className="relative z-10 flex justify-between w-full items-center">
                <span className={clsx(
                    "font-bold uppercase tracking-wider text-sm",
                    isActive ? "text-white" : "text-slate-500"
                )}>
                    {item.label}
                </span>
                <span className="font-mono text-slate-400 text-sm">
                    {Math.floor((item.durationMs / 1000) / 60)}:{((item.durationMs / 1000) % 60).toString().padStart(2, '0')}
                </span>
            </div>
        </div>
    );
};
