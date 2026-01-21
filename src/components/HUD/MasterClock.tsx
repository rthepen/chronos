import React from 'react';

interface Props {
    timeElapsed: number; // ms
    isFrozen: boolean;
}

const formatTime = (ms: number) => {
    const isNegative = ms < 0;
    const absMs = Math.abs(ms);
    const totalSeconds = Math.floor(absMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const sign = isNegative ? '-' : '';
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    return `${sign}${m}:${s}`;
};

export const MasterClock: React.FC<Props> = ({ timeElapsed, isFrozen }) => {
    return (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
            <div className="text-[6rem] leading-none font-bold text-white font-mono tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
                {formatTime(timeElapsed)}
            </div>
            <div className="text-nano-green uppercase tracking-[0.2em] text-sm font-semibold mt-2 animate-pulse">
                {isFrozen ? "Ready" : "Active Work"}
            </div>
        </div>
    );
};
