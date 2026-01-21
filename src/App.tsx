import { useMemo, useState } from 'react';
import { MasterClock } from './components/HUD/MasterClock'
import { ControlDeck } from './components/HUD/ControlDeck'
import { TimelineView } from './components/Timeline/TimelineView'
import { useChronos } from './hooks/useChronos'
import { useAudio } from './hooks/useAudio'
import { WorkoutGenerator } from './services/workoutGenerator'
import workoutData from './data/workoutdatabase.json'

function App() {
  // 1. Initialize State
  const [workoutSettings] = useState({ workTimeSec: 45, restTimeSec: 15, sets: 3, roundRestSec: 30 });

  // 2. Generate Timeline
  const timeline = useMemo(() => {
    // Select first 5 items from the DB for a good demo
    const selectedExercises = workoutData.slice(0, 5);
    return WorkoutGenerator.generateWorkout(selectedExercises, workoutSettings);
  }, [workoutSettings]);

  // 3. Init Engine
  const engine = useChronos(timeline, 30000); // 30s startup buffer

  // 4. Init Audio
  useAudio(engine.activeItemIndex, timeline);

  return (
    <div className="fixed inset-0 bg-slate-900 text-white font-mono select-none overflow-hidden overscroll-none touch-none">

      {/* Layer 1: Scrolling Timeline */}
      <div className="absolute inset-0 z-0">
        <TimelineView
          items={timeline}
          activeItemIndex={engine.activeItemIndex}
          activeItemProgress={engine.activeItemProgress}
          scrollOffsetPixels={engine.scrollOffsetPixels}
        />
      </div>

      {/* Layer 2: Master Clock (Top Overlay) */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-4 flex justify-center">
        <MasterClock
          timeElapsed={engine.timeElapsed}
          isFrozen={engine.isStartupFrozen}
        />
      </div>

      {/* Layer 3: Controls (Bottom Overlay) */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center pointer-events-auto">
        <ControlDeck
          isFrozen={engine.isStartupFrozen}
          onToggleFreeze={engine.releaseStart}
        />
      </div>

      {/* Optional: Simple Vignette/Gradient for aesthetics */}
      <div className="fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-10" />
    </div>
  );
}

export default App
