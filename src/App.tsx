import { MasterClock } from './components/HUD/MasterClock'
import { ControlDeck } from './components/HUD/ControlDeck'
import { TimelineView } from './components/Timeline/TimelineView'
import { useChronos } from './hooks/useChronos'
import type { TimelineItem } from './types/chronos'

// Mock Data (Moved from TimelineView)
const MOCK_TIMELINE: TimelineItem[] = [
  { id: '1', status: 'work', durationMs: 45000, label: 'Kettlebell Swings', progress: 0 },
  { id: '2', status: 'rest', durationMs: 15000, label: 'Rest', progress: 0 },
  { id: '3', status: 'work', durationMs: 45000, label: 'Goblet Squats', progress: 0 },
  { id: '4', status: 'rest', durationMs: 15000, label: 'Rest', progress: 0 },
  { id: '5', status: 'work', durationMs: 45000, label: 'Push Ups', progress: 0 },
];

function App() {
  const chronos = useChronos(MOCK_TIMELINE);

  return (
    <div className="relative w-full h-screen bg-nano-bg text-slate-200 overflow-hidden font-sans selection:bg-nano-green selection:text-nano-bg">
      {/* Layer 1: The Timeline (Full Height, Scrollable) */}
      <TimelineView
        items={MOCK_TIMELINE}
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
