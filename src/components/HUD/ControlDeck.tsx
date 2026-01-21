import React from 'react';
import { Play, FastForward, Pause } from 'lucide-react';

interface Props {
    isFrozen: boolean;
    onToggleFreeze: () => void;
}

export const ControlDeck: React.FC<Props> = ({ isFrozen, onToggleFreeze }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-nano-bg via-nano-bg/90 to-transparent z-50 pb-8">
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">

                {/* Secondary Action (Left) */}
                <button className="h-14 w-14 rounded-full bg-nano-surface border border-slate-700 flex items-center justify-center text-slate-400 active:scale-95 transition-transform">
                    <FastForward size={24} />
                </button>

                {/* Primary Action (Center - Hold/Release) */}
                <button
                    onClick={onToggleFreeze}
                    className="flex-1 h-16 rounded-2xl bg-nano-green text-nano-bg font-bold text-xl uppercase tracking-wider flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.3)] active:scale-95 transition-all active:shadow-none hover:bg-nano-green/90"
                >
                    {isFrozen ? (
                        <>
                            <Play size={24} className="mr-2 fill-current" />
                            Start
                        </>
                    ) : (
                        <>
                            <Pause size={24} className="mr-2 fill-current" />
                            Running
                        </>
                    )}

                </button>

            </div>
        </div>
    );
};
