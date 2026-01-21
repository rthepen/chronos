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
                isActive && "bg-slate-800 scale-105 shadow-xl border border-slate-700 z-10",
                // Past: Dimmed significantly
                isPast && "bg-slate-900/30 opacity-30 grayscale",
                // Future: Standard opacity
                !isActive && !isPast && "bg-slate-900/50 opacity-60"
            )}
        >
            {/* Progress Fill */}
            <div
                className={clsx(
                    "absolute top-0 left-0 h-full opacity-30 transition-none", // transition-none for instant updates
                    item.status === 'work' ? "bg-nano-green" : "bg-nano-blue"
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
