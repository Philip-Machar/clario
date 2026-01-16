import { FC, useState } from 'react';

interface FocusTimerProps {
  initialMinutes?: number;
}

/**
 * FocusTimer - Pomodoro-style focus session timer
 * Beautiful circular design matching the original ControlHub style
 */
const FocusTimer: FC<FocusTimerProps> = ({ initialMinutes = 25 }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);

  const handleStart = () => {
    setIsRunning(true);
    // Timer logic would go here
  };

  const handleStop = () => {
    setIsRunning(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  return (
    <div className="px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Focus Mode</span>
        <span className="uppercase tracking-[0.16em] text-emerald-300">
          Deep
        </span>
      </div>
      <div className="relative mx-auto mt-1 mb-1 h-24 w-24">
        <div className="absolute inset-0 rounded-full bg-slate-900" />
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
        <div className="absolute inset-1.5 rounded-full border border-slate-700/70" />
        <div className="absolute inset-2 rounded-full bg-slate-950 flex items-center justify-center">
          <span className="text-xl font-semibold text-slate-50">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      <button
        onClick={isRunning ? handleStop : handleStart}
        className="mt-1 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-xs font-semibold py-2 transition-colors"
      >
        {isRunning ? 'Stop session' : 'Start focus session'}
      </button>
    </div>
  );
};

export default FocusTimer;
