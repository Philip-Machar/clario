import { FC, useMemo } from 'react';
import type { Task } from '../../types';

interface TodaysOverviewProps {
  tasks?: Task[] | null;
  isLoading?: boolean;
}

interface MiniRingChartProps {
  percentage: number;
  size?: number;
}

const MiniRingChart: FC<MiniRingChartProps> = ({ percentage, size = 40 }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth="3"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-medium text-slate-300">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const TodaysOverview: FC<TodaysOverviewProps> = ({ tasks, isLoading = false }) => {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const month = today.toLocaleDateString('en-US', { month: 'short' });
  const day = today.getDate();

  // Calculate today's stats
  const todaysStats = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        completed: 0,
        allCompleted: 0,
        total: 0,
        inProgress: 0,
        completionRate: 0,
        donePercentage: 0,
        inProgressPercentage: 0,
        totalPercentage: 0,
      };
    }

    const todayStr = today.toISOString().split('T')[0];
    
    // Tasks completed today
    const completedToday = tasks.filter(
      task => task.status === 'complete' && 
      task.completed_at && 
      task.completed_at.startsWith(todayStr)
    ).length;

    // All completed tasks
    const allCompleted = tasks.filter(task => task.status === 'complete').length;
    
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((allCompleted / total) * 100) : 0;
    
    // Calculate percentages for each metric
    const donePercentage = total > 0 ? Math.round((allCompleted / total) * 100) : 0;
    const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    // Remaining tasks percentage: 100% when nothing is done, 0% when all are done
    const totalPercentage = total > 0 ? Math.round(((total - allCompleted) / total) * 100) : 0;

    return {
      completed: completedToday,
      allCompleted,
      total,
      inProgress,
      completionRate,
      donePercentage,
      inProgressPercentage,
      totalPercentage,
    };
  }, [tasks, today]);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 pb-2">
      <div className="rounded-xl sm:rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-slate-950/10 px-3 sm:px-4 md:px-6 py-2 sm:py-3 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        {/* Mobile/Tablet: Vertical layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.20em] sm:tracking-[0.25em] text-slate-500 uppercase">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-emerald-400" />
                Today's Overview
              </div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">
                {getGreeting()} • {dayOfWeek}, {month} {day}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500">
                Progress
              </div>
              <div className="text-lg sm:text-2xl font-semibold text-emerald-400">
                {isLoading ? '—' : `${todaysStats.completionRate}%`}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Tasks completed */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 bg-slate-900/40 rounded-lg sm:rounded-xl p-2 sm:p-3">
              {!isLoading && (
                <MiniRingChart percentage={todaysStats.donePercentage} size={36} />
              )}
              <div className="text-center">
                <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-[0.10em] sm:tracking-[0.15em]">
                  Done
                </div>
                <div className="text-sm sm:text-lg font-semibold text-emerald-400">
                  {isLoading ? '—' : todaysStats.allCompleted}
                </div>
              </div>
            </div>

            {/* Tasks in progress */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 bg-slate-900/40 rounded-lg sm:rounded-xl p-2 sm:p-3">
              {!isLoading && (
                <MiniRingChart percentage={todaysStats.inProgressPercentage} size={36} />
              )}
              <div className="text-center">
                <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-[0.10em] sm:tracking-[0.15em]">
                  Progress
                </div>
                <div className="text-sm sm:text-lg font-semibold text-slate-300">
                  {isLoading ? '—' : todaysStats.inProgress}
                </div>
              </div>
            </div>

            {/* Total tasks */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 bg-slate-900/40 rounded-lg sm:rounded-xl p-2 sm:p-3">
              {!isLoading && (
                <MiniRingChart percentage={todaysStats.totalPercentage} size={36} />
              )}
              <div className="text-center">
                <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-[0.10em] sm:tracking-[0.15em]">
                  Total
                </div>
                <div className="text-sm sm:text-lg font-semibold text-slate-200">
                  {isLoading ? '—' : todaysStats.total}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left: Date and greeting */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Today's Overview
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {getGreeting()} • {dayOfWeek}, {month} {day}
            </div>
          </div>

          {/* Center: Today's stats */}
          <div className="flex-1 px-8">
            <div className="flex items-center gap-8 justify-center">
              {/* Tasks completed */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-[0.15em]">
                    Done
                  </div>
                  <div className="text-lg font-semibold text-emerald-400">
                    {isLoading ? '—' : todaysStats.allCompleted}
                  </div>
                </div>
                {!isLoading && (
                  <MiniRingChart percentage={todaysStats.donePercentage} size={44} />
                )}
              </div>

              {/* Tasks in progress */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-[0.15em]">
                    In Progress
                  </div>
                  <div className="text-lg font-semibold text-slate-300">
                    {isLoading ? '—' : todaysStats.inProgress}
                  </div>
                </div>
                {!isLoading && (
                  <MiniRingChart percentage={todaysStats.inProgressPercentage} size={44} />
                )}
              </div>

              {/* Total tasks */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-[0.15em]">
                    Total Tasks
                  </div>
                  <div className="text-lg font-semibold text-slate-200">
                    {isLoading ? '—' : todaysStats.total}
                  </div>
                </div>
                {!isLoading && (
                  <MiniRingChart percentage={todaysStats.totalPercentage} size={44} />
                )}
              </div>
            </div>
          </div>

          {/* Right: Completion rate */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Today's Progress
              </div>
              <div className="text-2xl font-semibold text-emerald-400">
                {isLoading ? '—' : `${todaysStats.completionRate}%`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodaysOverview;
