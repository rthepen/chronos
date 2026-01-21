import React from 'react';
import { TimelineItem } from './TimelineItem';
import type { TimelineItem as TimelineItemType } from '../../types/chronos';

interface Props {
    items: TimelineItemType[];
    activeItemIndex: number;
    activeItemProgress: number;
    scrollOffsetPixels: number;
}

export const TimelineView: React.FC<Props> = ({
    items,
    activeItemIndex,
    activeItemProgress,
    scrollOffsetPixels
}) => {
    // We apply the transform to the inner container
    // If the list moves UP, we need a negative translateY
    // But wait, "scrollOffsetPixels" was calculated as positive magnitude of "amount passed".
    // So we translate Y by -scrollOffsetPixels.

    // To ensure "center" alignment, we might need an initial offset.
    // If the "needle" is at 50vh, and the list starts at 50vh?
    // Let's assume the CSS handles the initial "needle" position (e.g. padding-top: 50vh).
    // The current CSS has `padding-top: 32` (8rem = 128px).
    // Let's rely on the `scrollOffsetPixels` to just shift the content.

    return (
        <div className="w-full h-screen overflow-hidden bg-nano-bg relative">
            {/* The "Needle" or Focus Marker (Visual Aid) */}
            <div className="absolute top-[30%] left-0 w-full h-px bg-red-500/0 z-50 pointer-events-none" />

            {/* Scrollable Container (Logic Driven) */}
            <div
                className="w-full h-full will-change-transform"
                style={{
                    // We add an initial "padding" visually by starting lower? 
                    // Or we just rely on the parent padding.
                    // Let's keep it simple: transform based on signal.
                    // using 30vh as the "Active Zone" offset
                    transform: `translateY(calc(30vh - ${scrollOffsetPixels}px))`
                }}
            >
                <div className="max-w-md mx-auto pt-0 pb-96">
                    <TimelineItem
                        key={item.id}
                        item={{
                            ...item,
                            progress: index === activeItemIndex ? activeItemProgress : (index < activeItemIndex ? 1 : 0)
                        }}
                        isActive={index === activeItemIndex}
                        isPast={index < activeItemIndex}
                    />
                </div>
            </div>
        </div>
    );
};
