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

        // Map new Types to Audio Categories
        switch (item.type) {
            case 'WORK':
                category = 'work';
                break;
            case 'REST':
            case 'ROUND_REST':
            case 'PREPARE': // Maybe silence or special 'get ready'? For now 'rest' implies downtime.
                category = 'rest';
                break;
            case 'FINISH':
                // Handled separately in the effect roughly, but if we need a direct cue here:
                // The effect handles "Finish" when index exceeds length. 
                // But if we have a 'FINISH' item, we might want to play it when entering that item.
                // For now, let's keep the Effect's finish logic for end-of-playlist,
                // OR we play 'finish' when entering the FINISH item.
                // Let's assume the 'FINISH' item is the visual "Done" state.
                AudioEngine.playCue('eva', 'finish');
                return;
        }

        if (category) {
            // Hardcoded 'eva' per requirements
            AudioEngine.playCue('eva', category);
        } else {
            console.log(`[useAudio] No cue for type: ${item.type}`);
        }
    };
};
