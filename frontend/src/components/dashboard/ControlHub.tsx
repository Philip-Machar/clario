import { FC } from 'react';
import type { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ControlHubProps {
  tasks: Task[] | null | undefined;
}

const ControlHub: FC<ControlHubProps> = ({ tasks }) => {
  const { user } = useAuth();
  const safeTasks = tasks ?? [];
  const activeWorkCount = safeTasks.filter(
    t => t.status === 'todo' || t.status === 'in_progress',
  ).length;

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400/80 via-cyan-400/80 to-sky-500/80 flex items-center justify-center text-sm font-semibold text-slate-950">
          {user?.username?.[0]?.toUpperCase() ?? 'C'}
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Control Hub
          </div>
          <div className="mt-1 text-sm text-slate-200 line-clamp-1">
            Level 5 Achiever
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800/90 overflow-hidden">
            <div className="h-full w-[64%] bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-200" />
          </div>
        </div>
      </div>

      {/* Focus timer (static visual for now) */}
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

      {/* Tags */}
      <div className="mt-1 space-y-3">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-[0.18em]">
          Channels
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 text-emerald-200">
            Work • {activeWorkCount}
          </span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300/90">
            Personal
          </span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300/90">
            Fitness
          </span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300/90">
            Reflection
          </span>
        </div>
      </div>
    </section>
  );
};

export default ControlHub;

