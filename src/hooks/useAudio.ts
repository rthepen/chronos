import { useEffect, useRef } from 'react';
import type { TimelineItem } from '../types/chronos';
import { AudioEngine } from '../services/audioEngine';

export const useAudio = (
    activeItemIndex: number,
    timelineData: TimelineItem[]
) => {
    // Initialize refs to track previous state
    // Start with current index to avoid firing on initial render if already 0?
    // Actually, distinct changes are what we want. 
    // If app starts fresh, activeItemIndex is likely -1.
    const prevIndexRef = useRef(activeItemIndex);

    useEffect(() => {
        const prevIndex = prevIndexRef.current;

        // Ignore if no change
        if (activeItemIndex === prevIndex) return;

        // Transition Logic
        if (prevIndex === -1 && activeItemIndex === 0) {
            // START
            playCueForIndex(activeItemIndex, timelineData);
        } else if (activeItemIndex >= 0 && activeItemIndex < timelineData.length) {
            // Next Item
            playCueForIndex(activeItemIndex, timelineData);
        } else if (activeItemIndex === timelineData.length && prevIndex === timelineData.length - 1) {
            // FINISH
            AudioEngine.playCue('eva', 'finish');
        }

        // Update Ref
        prevIndexRef.current = activeItemIndex;
    }, [activeItemIndex, timelineData]);

    const playCueForIndex = (index: number, data: TimelineItem[]) => {
        const item = data[index];
        if (!item) return;

        let category: 'work' | 'rest' | null = null;
        if (item.status === 'work') category = 'work';
        else if (item.status === 'rest') category = 'rest';

        if (category) {
            // Hardcoded 'eva' per requirements
            AudioEngine.playCue('eva', category);
        } else {
            // 'switch' or other statuses
            console.log(`[useAudio] No cue for status: ${item.status}`);
        }
    };
};
