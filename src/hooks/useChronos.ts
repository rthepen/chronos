import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimelineItem } from '../types/chronos';

// Constants for layout logic
const ITEM_HEIGHT_PX = 64; // h-16
const ITEM_MARGIN_PX = 8;  // mb-2
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT_PX + ITEM_MARGIN_PX; // 72px total slot per item

interface UseChronosReturn {
    // State
    now: number;
    workoutStartTime: number;
    isStartupFrozen: boolean;

    // Derived
    timeElapsed: number;
    activeItemIndex: number;
    activeItemProgress: number; // 0 to 1
    scrollOffsetPixels: number;

    // Actions
    releaseStart: () => void;
}

export const useChronos = (
    timelineData: TimelineItem[],
    startupOffsetMs: number = 30000 // Default 30s countdown
): UseChronosReturn => {
    // STATE
    const [now, setNow] = useState<number>(Date.now());
    const [isStartupFrozen, setIsStartupFrozen] = useState<boolean>(true);
    // When frozen, this keeps moving into the future. When released, it stays fixed.
    const [workoutStartTime, setWorkoutStartTime] = useState<number>(Date.now() + startupOffsetMs);

    const requestRef = useRef<number>();

    // THE GAME LOOP
    const tick = useCallback(() => {
        const currentTimestamp = Date.now();
        setNow(currentTimestamp);

        if (isStartupFrozen) {
            // "Floating Start": Keep pushing the start time forward so the countdown stays at -30s (or whatever offset)
            // Actually, if we want strict "countdown", we calculate countdown = start - now. 
            // If frozen, we want countdown to stay static? Or do we want it to count down but NOT start?
            // User requirement: "The Floating Start: When the app loads, it enters 'Frozen' mode. The clock should show the countdown (e.g. -00:30) but NOT count down until the user hits 'Release'."
            // So: workoutStartTime should be strictly `Date.now() + startupOffsetMs` on every frame while frozen.
            setWorkoutStartTime(currentTimestamp + startupOffsetMs);
        }

        requestRef.current = requestAnimationFrame(tick);
    }, [isStartupFrozen, startupOffsetMs]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(tick);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [tick]);

    // ACTIONS
    const releaseStart = useCallback(() => {
        setIsStartupFrozen(false);
        // On release, we lock the workoutStartTime.
        // It's already being updated in the loop, but let's ensure it's set relative to NOW one last time to be precise (+offset)
        // Actually, if we want it to start "now" (time 0) or "start counting down from offset"?
        // Usually "Release" means "Start the workout".
        // If countdown is -00:30, and we hit release, does it start counting down 29, 28...? 
        // OR does it skip to 00:00?
        // Requirement: "The clock should show the countdown (e.g. -00:30) but NOT count down until the user hits 'Release'."
        // This implies: Frozen = Locked at -00:30. Released = Starts ticking -29, -28... 00:00 ... 

        // WAIT. "Floating Start" usually means:
        // Frozen: Clock says T minus 30. (Fixed).
        // Release: Clock starts ticking T minus 29....
        // So:
        // Frozen: `workoutStartTime` = `Date.now() + startupOffsetMs`. (So `workoutStartTime - now` is always `startupOffsetMs`).
        // Released: `workoutStartTime` stops moving. `now` keeps moving. So `workoutStartTime - now` shrinks.

        // Logic check:
        // Frozen loop: setWorkoutStartTime(Date.now() + startupOffsetMs) -> CORRECT.
        // Released: setStartupFrozen(false). The loop STOPS updating workoutStartTime. -> CORRECT.

        setIsStartupFrozen(false);
    }, []);


    // DERIVED STATE
    // timeElapsed: usually positive if started. Negative if undefined/countdown?
    // Let's define: timeElapsed = now - workoutStartTime. 
    // If waiting (T minus 30): timeElapsed = -30000.
    const timeElapsed = now - workoutStartTime;

    // Active Item Logic
    // We only care about positive progress for items logic?
    // If we include the warm up (T minus), maybe we don't show active items yet?
    // Assuming timeline starts at T=0.

    let activeItemIndex = -1;
    let activeItemProgress = 0;
    let accumulatedDuration = 0;

    if (timeElapsed >= 0) {
        for (let i = 0; i < timelineData.length; i++) {
            const item = timelineData[i];
            const itemStart = accumulatedDuration;
            const itemEnd = itemStart + item.durationMs;

            if (timeElapsed >= itemStart && timeElapsed < itemEnd) {
                // Found the active item
                activeItemIndex = i;
                const timeInItem = timeElapsed - itemStart;
                activeItemProgress = timeInItem / item.durationMs;
                break;
            } else if (timeElapsed >= itemEnd && i === timelineData.length - 1) {
                // Post-workout state (past last item)
                activeItemIndex = timelineData.length; // Indicates "finished"
                activeItemProgress = 1;
            }

            accumulatedDuration += item.durationMs;
        }
    } else {
        // Pre-workout
        activeItemIndex = -1; // Specific state for "Warmup/Countdown"
        activeItemProgress = 0;
    }

    // Scroll Offset Logic
    // Move UP pixel by pixel based on time.
    // If timeElapsed < 0, offset should be 0 (or stay at top).
    // offset = (pixels for full past items) + (pixels for current item progress)

    let scrollOffsetPixels = 0;
    if (activeItemIndex >= 0 && activeItemIndex < timelineData.length) {
        scrollOffsetPixels = (activeItemIndex * TOTAL_ITEM_HEIGHT) + (activeItemProgress * TOTAL_ITEM_HEIGHT);
    } else if (activeItemIndex >= timelineData.length) {
        // Finished - scroll to end
        scrollOffsetPixels = timelineData.length * TOTAL_ITEM_HEIGHT;
    }

    // Refinement: If we want "smooth" scrolling via pixels, the above formula works perfectly linear.
    // If we wanted "snap" scrolling, we'd remove the progress part. But "Playhead Logic" usually implies smooth.

    return {
        now,
        workoutStartTime,
        isStartupFrozen,
        timeElapsed,
        activeItemIndex,
        activeItemProgress,
        scrollOffsetPixels,
        releaseStart
    };
};
