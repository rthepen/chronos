import type { TimelineItem } from '../types/chronos';

// Define the shape of our source data (matches subset of workoutdatabase.json)
export interface Exercise {
    id: string;
    exercise_name: string;
    // Add other fields if needed for UI mapping later
}

export interface WorkoutSettings {
    workMs: number;
    restMs: number;
    sets: number;
    roundRestMs: number;
}

export const WorkoutGenerator = {
    /**
     * Flattens a list of Exercises + Settings into a linear Timeline.
     */
    generate: (exercises: Exercise[], settings: WorkoutSettings): TimelineItem[] => {
        const timeline: TimelineItem[] = [];
        let itemIdCounter = 1;

        // Helper to create IDs
        const nextId = () => `item-${itemIdCounter++}`;

        // 1. PREPARE Phase (Fixed 10s or custom?)
        timeline.push({
            id: nextId(),
            type: 'PREPARE',
            durationMs: 10000,
            progress: 0,
            label: 'Get Ready',
        });

        // 2. Loop Exercises
        exercises.forEach((exercise, exIndex) => {
            const isLastExercise = exIndex === exercises.length - 1;

            // 3. Loop Sets
            for (let set = 1; set <= settings.sets; set++) {
                const isLastSet = set === settings.sets;

                // A. WORK
                timeline.push({
                    id: nextId(),
                    type: 'WORK',
                    durationMs: settings.workMs, // Already in ms
                    progress: 0,
                    label: exercise.exercise_name,
                    exerciseId: exercise.id
                });

                // B. REST (If not last set)
                // If it IS the last set, we might do Round Rest instead.
                if (!isLastSet) {
                    timeline.push({
                        id: nextId(),
                        type: 'REST',
                        durationMs: settings.restMs, // Already in ms
                        progress: 0,
                        label: 'Rest',
                    });
                }
            }

            // 4. ROUND REST (After all sets of this exercise, if more exercises exist)
            if (!isLastExercise) {
                timeline.push({
                    id: nextId(),
                    type: 'ROUND_REST',
                    durationMs: settings.roundRestMs, // Already in ms
                    progress: 0,
                    label: 'Switch Exercise',
                });
            }
        });

        // 5. FINISH Match
        timeline.push({
            id: nextId(),
            type: 'FINISH',
            durationMs: 5000,
            progress: 0,
            label: 'Workout Complete',
        });

        return timeline;
    }
};
