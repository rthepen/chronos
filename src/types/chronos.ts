/**
 * CHRONOS ENGINE TYPES
 *
 * Core data structures for the FlowState timer engine.
 */

export interface TimelineItem {
    id: string;
    durationMs: number;
    type: 'WORK' | 'REST' | 'PREPARE' | 'ROUND_REST' | 'FINISH';
    progress: number; // 0 to 1
    label: string;
    exerciseId?: string; // Link back to full exercise data
    // Add other properties as needed
}

export interface ChronosState {
    timeline: TimelineItem[];
    workoutStartTime: number; // Timestamp in ms
    isStartupFrozen: boolean; // TRUE = "Hold" mode (Floating Start)
    startupOffsetMs: number; // Default e.g., 30000

    // ENGINE LOGIC:
    // If `isStartupFrozen` is TRUE:
    //   The UI displays `startupOffsetMs` (static).
    //   The `workoutStartTime` is continuously updated to `Date.now() + startupOffsetMs`.
    //
    // If `isStartupFrozen` is FALSE:
    //   The UI displays `workoutStartTime - Date.now()`.
    //   The `workoutStartTime` is fixed.
}
