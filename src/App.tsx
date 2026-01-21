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

  const chronos = useChronos(timeline);
  useAudio(chronos.activeItemIndex, timeline);

  return (
    <div className="relative w-full h-screen bg-nano-bg text-slate-200 overflow-hidden font-sans selection:bg-nano-green selection:text-nano-bg">
      {/* Layer 1: The Timeline (Full Height, Scrollable) */}
      <TimelineView
        items={timeline}
        activeItemIndex={chronos.activeItemIndex}
        activeItemProgress={chronos.activeItemProgress}
        scrollOffsetPixels={chronos.scrollOffsetPixels}
      />

      {/* Layer 2: Master Clock (Overlay) */}
      <MasterClock
        timeElapsed={chronos.timeElapsed}
        isFrozen={chronos.isStartupFrozen}
      />

      {/* Layer 3: Control Deck (Fixed Bottom) */}
      <ControlDeck
        isFrozen={chronos.isStartupFrozen}
        onRelease={chronos.releaseStart}
      />

      {/* Gradient Ambient Effects */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-nano-bg to-transparent pointer-events-none z-40" />
    </div>
  )
}

export default App
