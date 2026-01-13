import { FC } from 'react';

interface StreakMatrixProps {
  streak: number | null;
  isLoading: boolean;
}

const DAYS_IN_VIEW = 32;

const StreakMatrix: FC<StreakMatrixProps> = ({ streak, isLoading }) => {
  const today = new Date();
  const currentDay = today.getDate();

  return (
    <section className="px-10 pb-4">
      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-slate-950/10 px-6 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Streak Matrix
          </div>
          <div className="mt-2 text-sm text-slate-400">
            Consistency over the last {DAYS_IN_VIEW} days
          </div>
        </div>
        <div className="flex-1 px-8">
          <div className="flex items-center gap-1 justify-center">
            {Array.from({ length: DAYS_IN_VIEW }).map((_, idx) => {
              const day = idx + 1;
              const isToday = day === currentDay;
              const isActive =
                streak !== null && day > currentDay - streak && day <= currentDay;
              const color = isActive ? 'bg-emerald-500' : 'bg-slate-800/80';
              return (
                <div
                  key={day}
                  className={`h-5 w-5 rounded-md ${color} relative overflow-hidden`}
                >
                  {isToday && (
                    <div className="absolute inset-0 ring-2 ring-emerald-400/80 rounded-md" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Current streak
            </div>
            <div className="text-2xl font-semibold text-emerald-400">
              {isLoading || streak === null ? '—' : `${streak}d`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StreakMatrix;

