import { useMemo } from 'react';
import { MasterClock } from './components/HUD/MasterClock'
import { ControlDeck } from './components/HUD/ControlDeck'
import { TimelineView } from './components/Timeline/TimelineView'
import { useChronos } from './hooks/useChronos'
import { useAudio } from './hooks/useAudio'
import { WorkoutGenerator } from './services/workoutGenerator'
import workoutData from './data/workoutdatabase.json'

function App() {
  // 1. Generate the Workout Timeline
  // For demo: Pick 3 exercises and default settings
  const timeline = useMemo(() => {
    // Select first 3 items from the DB
    const selectedExercises = workoutData.slice(0, 3);

    // Default Settings (as per requirements)
    const settings = {
      workTimeSec: 45,
      restTimeSec: 15,
      sets: 2,
      roundRestSec: 30
    };

    return WorkoutGenerator.generateWorkout(selectedExercises, settings);
  }, []);

  const {
    activeItemIndex,
    activeItemProgress,
    scrollOffsetPixels,
    timeElapsed,
    isStartupFrozen,
    releaseStart,
    workoutStartTime
  } = useChronos(timeline);

  // Audio Hook
  useAudio(activeItemIndex, timeline);

  const toggleFreeze = releaseStart;
  const startupOffsetMs = 30000; // Hardcoded default for now, or derive if useChronos exports it

  return (
    <div className="fixed inset-0 bg-nano-bg text-white font-mono select-none overflow-hidden touch-none">
      {/* Layer 1: The Timeline (Background/Scroll) */}
      <div className="absolute inset-0 z-0">
        <TimelineView
          items={timeline}
          activeItemIndex={activeItemIndex}
          activeItemProgress={activeItemProgress}
          scrollOffsetPixels={scrollOffsetPixels}
        />
      </div>

      {/* Layer 2: Master Clock (Fixed Overlay) */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <MasterClock
          timeElapsed={timeElapsed}
          isFrozen={isStartupFrozen}
        />
      </div>

      {/* Layer 3: Controls (Bottom Fixed) */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center">
        <ControlDeck
          isFrozen={isStartupFrozen}
          onToggleFreeze={toggleFreeze}
        />
      </div>

      {/* Gradient Ambient Effects (Optional, kept for aesthetics if valid) */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-nano-bg to-transparent pointer-events-none z-10" />
    </div>
  )
}

export default App
