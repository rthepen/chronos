import React, { useState, useMemo } from 'react';
import { useChronos } from './hooks/useChronos';
import { useAudio } from './hooks/useAudio';
import { MasterClock } from './components/HUD/MasterClock';
import { ControlDeck } from './components/HUD/ControlDeck';
import { TimelineView } from './components/Timeline/TimelineView';
import { WorkoutGenerator } from './services/workoutGenerator';
import workoutDatabase from './data/workoutdatabase.json';
import type { Exercise } from './types/chronos';

export default function App() {
  // 1. Settings State
  const [settings] = useState({
    workMs: 45000,
    restMs: 15000,
    sets: 3,
    roundRestMs: 30000
  });

  // 2. Generate Timeline (Memoized)
  const timeline = useMemo(() => {
    // Take first 3 exercises for demo
    const demoExercises = (workoutDatabase as Exercise[]).slice(0, 3);
    return WorkoutGenerator.generate(demoExercises, settings);
  }, [settings]);

  // 3. Initialize Engine
  const {
    timeElapsed,
    activeItemIndex,
    isStartupFrozen,
    startupOffsetMs,
    toggleFreeze
  } = useChronos(timeline, 30000);

  // 4. Initialize Audio
  useAudio(activeItemIndex, timeline);

  // 5. RENDER (Nano Banana Shell)
  return (
    <div className="fixed inset-0 bg-[#0f172a] text-white font-mono overflow-hidden touch-none select-none">

      {/* Layer 1: The Timeline */}
      <div className="absolute inset-0 z-0">
        <TimelineView
          timeline={timeline}
          activeItemIndex={activeItemIndex}
        />
      </div>

      {/* Layer 2: Top HUD (Clock) */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-4 flex justify-center bg-gradient-to-b from-black/80 to-transparent">
        <MasterClock
          timeElapsed={timeElapsed}
          isStartupFrozen={isStartupFrozen}
          startupOffsetMs={startupOffsetMs}
        />
      </div>

      {/* Layer 3: Bottom HUD (Controls) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 flex justify-center bg-gradient-to-t from-black/90 to-transparent">
        <ControlDeck
          isFrozen={isStartupFrozen}
          onToggleFreeze={toggleFreeze}
        />
      </div>
    </div>
  );
}
