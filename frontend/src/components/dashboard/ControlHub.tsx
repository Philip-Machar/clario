import { FC } from 'react';

interface ControlHubProps {
  tasks?: any[] | null;
}

const ControlHub: FC<ControlHubProps> = ({ tasks }) => {
  const user = { username: 'Machar' };

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 flex flex-col gap-5">
      {/* Focus timer */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Focus Mode</span>
          <span className="uppercase tracking-[0.16em] text-emerald-300">
            Deep
          </span>
        </div>
        <div className="relative mx-auto mt-1 mb-1 h-28 w-28">
          <div className="absolute inset-0 rounded-full bg-slate-900" />
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
          <div className="absolute inset-1.5 rounded-full border border-slate-700/70" />
          <div className="absolute inset-2 rounded-full bg-slate-950 flex items-center justify-center">
            <span className="text-2xl font-semibold text-slate-50">
              25:00
            </span>
          </div>
        </div>
        <button className="mt-1 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-xs font-semibold py-2.5 transition-colors">
          Start focus session
        </button>
      </div>

      {/* Daily Velocity */}
      <div className="mt-1 space-y-3">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-[0.18em]">
          Daily Velocity
        </div>
        
        {/* Focus Time */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-300">Focus Time</span>
            <span className="text-sm font-semibold text-slate-200">2h 15m</span>
          </div>
          <div className="relative h-5 w-full rounded-full bg-slate-800/90 overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              style={{ width: '50%' }}
            />
          </div>
        </div>

        {/* Tasks Crushed */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-300">Tasks Crushed</span>
            <span className="text-sm font-semibold text-slate-200">3 / 8</span>
          </div>
          <div className="relative h-5 w-full rounded-full bg-slate-800/90 overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              style={{ width: '37%' }}
            />
          </div>
        </div>

        {/* Efficiency */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-300">Efficiency</span>
            <span className="text-sm font-semibold text-slate-200">85%</span>
          </div>
          <div className="relative h-5 w-full rounded-full bg-slate-800/90 overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              style={{ width: '85%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControlHub;