import { FC, useMemo } from 'react';
import type { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ControlHubProps {
  tasks: Task[] | null | undefined;
}

const ControlHub: FC<ControlHubProps> = () => {
  const { user } = useAuth();
  
  // Generate heatmap data for monthly progress visualization
  const heatmapData = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    
    // Generate realistic dummy data with variation
    const dailyData = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      
      // No data for future days
      if (day > currentDay) return 0;
      
      // Create a pattern with some variation
      const dayOfWeek = new Date(now.getFullYear(), now.getMonth(), day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Base value with some randomness
      let value = isWeekend 
        ? Math.floor(Math.random() * 4) // 0-3 for weekends
        : Math.floor(Math.random() * 10) + 3; // 3-12 for weekdays
      
      // Add some peak days
      if (day % 7 === 0) value += Math.floor(Math.random() * 5); // Boost every week
      if (day === currentDay) value = Math.floor(Math.random() * 8) + 5; // Today's activity
      
      return value;
    });
    
    // Organize into weeks (7 columns)
    const weeks: number[][] = [];
    let currentWeek: number[] = [];
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(-1); // -1 means empty/invalid
    }
    
    dailyData.forEach((value) => {
      currentWeek.push(value);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days to last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(-1); // Fill with empty cells
      }
      weeks.push(currentWeek);
    }
    
    return { weeks, maxValue: Math.max(...dailyData, 1) };
  }, []);
  
  // Get intensity level (0-4) for color coding
  const getIntensity = (value: number, maxValue: number): number => {
    if (value <= 0) return 0;
    const ratio = value / maxValue;
    if (ratio >= 0.8) return 4;
    if (ratio >= 0.6) return 3;
    if (ratio >= 0.4) return 2;
    if (ratio >= 0.2) return 1;
    return 1;
  };

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-4 flex flex-col gap-3 h-full overflow-hidden">
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
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Focus Mode</span>
          <span className="uppercase tracking-[0.16em] text-emerald-300">
            Deep
          </span>
        </div>
        <div className="relative mx-auto mt-1 mb-1 h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-slate-900" />
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
          <div className="absolute inset-1.5 rounded-full border border-slate-700/70" />
          <div className="absolute inset-2 rounded-full bg-slate-950 flex items-center justify-center">
            <span className="text-lg font-semibold text-slate-50">
              25:00
            </span>
          </div>
        </div>
        <button className="mt-0.5 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-xs font-semibold py-2 transition-colors">
          Start focus session
        </button>
      </div>

      {/* Monthly Progress Heatmap */}
      <div className="mt-1 space-y-2 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-[0.18em]">
            Monthly Progress
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded bg-slate-800/60" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-500/30" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-500/50" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-500/70" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            </div>
            <span>More</span>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-3 py-3 flex-1 min-h-0 flex flex-col">
          <div className="space-y-1 flex-1 min-h-0">
            {/* Day labels */}
            <div className="flex gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className="flex-1 text-center text-[10px] text-slate-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="space-y-1 flex-1 min-h-0 overflow-y-auto custom-scroll">
              {heatmapData.weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex gap-1">
                  {week.map((value, dayIdx) => {
                    const dayNumber = weekIdx * 7 + dayIdx - (new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()) + 1;
                    const isToday = dayNumber === new Date().getDate() && value >= 0;
                    const intensity = getIntensity(value, heatmapData.maxValue);
                    const isValid = value >= 0;
                    
                    return (
                      <div
                        key={dayIdx}
                        className={`flex-1 aspect-square rounded transition-all duration-200 ${
                          !isValid
                            ? 'bg-transparent'
                            : isToday
                            ? 'ring-2 ring-emerald-400/60 ring-offset-1 ring-offset-slate-900'
                            : intensity === 0
                            ? 'bg-slate-800/60'
                            : intensity === 1
                            ? 'bg-emerald-500/30 hover:bg-emerald-500/40'
                            : intensity === 2
                            ? 'bg-emerald-500/50 hover:bg-emerald-500/60'
                            : intensity === 3
                            ? 'bg-emerald-500/70 hover:bg-emerald-500/80'
                            : 'bg-emerald-500 hover:bg-emerald-400'
                        }`}
                        title={
                          isValid
                            ? `${dayNumber} tasks completed: ${value}`
                            : ''
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary stats */}
          <div className="mt-2 pt-2 border-t border-slate-800/90 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.12em]">
                This Month
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">
                {heatmapData.weeks
                  .flat()
                  .filter(v => v >= 0)
                  .reduce((a, b) => a + b, 0)}{' '}
                tasks
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.12em]">
                Current Streak
              </div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                {(() => {
                  const today = new Date().getDate();
                  let streak = 0;
                  for (let i = today; i >= 1; i--) {
                    const dayValue = heatmapData.weeks
                      .flat()
                      .filter(v => v >= 0)[i - 1];
                    if (dayValue > 0) streak++;
                    else break;
                  }
                  return `${streak} days`;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControlHub;