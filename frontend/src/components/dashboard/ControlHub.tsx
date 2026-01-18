import { FC, useState, useEffect, useRef } from 'react';
import { fetchCurrentStreak, fetchMonthlyHeatmap } from '../../features/tasks/taskService';

interface Task {
  id: number;
  title: string;
  status: string;
}

interface ControlHubProps {
  tasks?: Task[] | null;
}

const ControlHub: FC<ControlHubProps> = ({ tasks }) => {
  const user = { username: 'Machar' };
  const safeTasks = tasks ?? [];
  const todayProgress = 0; // Replace with actual calculation

  // Focus timer state
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editValue, setEditValue] = useState('25');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Heatmap and streak state
  const [heatmapData, setHeatmapData] = useState<{ [date: string]: number }>({});
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [isLoadingHeatmap, setIsLoadingHeatmap] = useState(true);

  // Fetch heatmap and streak data
  useEffect(() => {
    const loadHeatmapData = async () => {
      try {
        setIsLoadingHeatmap(true);
        const [heatmap, streak] = await Promise.all([
          fetchMonthlyHeatmap(),
          fetchCurrentStreak()
        ]);
        setHeatmapData(heatmap);
        setCurrentStreak(streak);
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
      } finally {
        setIsLoadingHeatmap(false);
      }
    };
    loadHeatmapData();
  }, []);

  // Countdown logic
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeRemaining]);

  // Get current month name
  const getCurrentMonthName = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const today = new Date();
    return monthNames[today.getMonth()];
  };

  // Transform heatmap data into monthly calendar grid
  const getHeatmapGrid = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const grid: number[][] = [];
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDay.getDate();
    
    // Calculate total cells needed (including leading empty cells)
    const totalCells = firstDayOfWeek + totalDaysInMonth;
    const totalWeeks = Math.ceil(totalCells / 7);
    
    let dayCounter = 1;
    
    // Build the calendar grid
    for (let week = 0; week < totalWeeks; week++) {
      const weekData: number[] = [];
      
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const cellIndex = week * 7 + dayOfWeek;
        
        // Empty cells before the first day of the month
        if (cellIndex < firstDayOfWeek) {
          weekData.push(-1); // -1 = not part of this month
        }
        // Days of the month
        else if (dayCounter <= totalDaysInMonth) {
          const currentDate = new Date(year, month, dayCounter);
          const dateStr = currentDate.toISOString().split('T')[0];
          weekData.push(heatmapData[dateStr] || 0);
          dayCounter++;
        }
        // Empty cells after the last day of the month
        else {
          weekData.push(-1);
        }
      }
      
      grid.push(weekData);
    }
    
    return grid;
  };

  // Calculate today's position in the monthly calendar grid
  const getTodayPosition = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const dayOfMonth = today.getDate();
    
    // Get first day of the month to calculate offset
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate position in grid
    const totalDays = firstDayOfWeek + dayOfMonth - 1; // -1 because day 1 is at index firstDayOfWeek
    const weekIdx = Math.floor(totalDays / 7);
    const dayIdx = totalDays % 7;
    
    return { weekIdx, dayIdx };
  };

  // Calculate total tasks this month
  const getTotalMonthlyTasks = () => {
    return Object.values(heatmapData).reduce((sum, count) => sum + count, 0);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for circle
  const progressPercentage = focusMinutes > 0 
    ? ((focusMinutes * 60 - timeRemaining) / (focusMinutes * 60)) * 100 
    : 0;

  // Get incomplete tasks for dropdown
  const availableTasks = safeTasks.filter(task => task.status !== 'complete');

  const handleStart = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(focusMinutes * 60);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(focusMinutes * 60);
  };

  const handleSetTime = (minutes: number) => {
    if (!isRunning && !isPaused) {
      setFocusMinutes(minutes);
      setTimeRemaining(minutes * 60);
    }
  };

  const handleTimeClick = () => {
    if (!isRunning && !isPaused) {
      setIsEditingTime(true);
      setEditValue(focusMinutes.toString());
    }
  };

  const handleTimeBlur = () => {
    const minutes = parseInt(editValue);
    if (!isNaN(minutes) && minutes > 0 && minutes <= 999) {
      setFocusMinutes(minutes);
      setTimeRemaining(minutes * 60);
    } else {
      setEditValue(focusMinutes.toString());
    }
    setIsEditingTime(false);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTimeBlur();
    } else if (e.key === 'Escape') {
      setEditValue(focusMinutes.toString());
      setIsEditingTime(false);
    }
  };

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-3 sm:p-4 flex flex-col gap-2 h-full overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400/80 via-cyan-400/80 to-sky-500/80 flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-950">
          {user?.username?.[0]?.toUpperCase() ?? 'C'}
        </div>
        <div className="flex-1">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.20em] sm:tracking-[0.28em] text-slate-500">
            Control Hub
          </div>
          <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-200 line-clamp-1">
            Today's Progress
          </div>
          <div className="mt-1 sm:mt-2 h-1 sm:h-1.5 w-full rounded-full bg-slate-800/90 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-200 transition-all duration-500"
              style={{ width: `${todayProgress}%` }}
            />
          </div>
          <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-400 text-right">
            {todayProgress}%
          </div>
        </div>
      </div>

      {/* Focus timer */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Focus Mode</span>
          <span className="uppercase tracking-[0.16em] text-emerald-300">
            {isRunning ? 'Active' : isPaused ? 'Paused' : 'Ready'}
          </span>
        </div>

        {/* Task selection */}
        {availableTasks.length > 0 && (
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">Select Task</label>
            <select
              value={selectedTaskId || ''}
              onChange={(e) => setSelectedTaskId(e.target.value ? parseInt(e.target.value) : null)}
              disabled={isRunning || isPaused}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-2.5 py-1 pr-8 text-[11px] text-slate-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238c9ca6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '12px 8px'
              }}
            >
              <option value="" className="bg-slate-900 text-slate-100">No task selected</option>
              {availableTasks.map(task => (
                <option key={task.id} value={task.id} className="bg-slate-900 text-slate-100">
                  {task.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timer display */}
        <div 
          className={`relative mx-auto h-16 w-16 ${!isRunning && !isPaused ? 'cursor-pointer' : ''}`}
          onClick={handleTimeClick}
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(51, 65, 85, 0.3)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isEditingTime ? (
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleTimeBlur}
                onKeyDown={handleTimeKeyDown}
                autoFocus
                className="w-12 text-center text-lg font-semibold text-slate-50 bg-transparent border-b border-emerald-400 outline-none"
                min="1"
                max="999"
              />
            ) : (
              <span className="text-lg font-semibold text-slate-50">
                {formatTime(timeRemaining)}
              </span>
            )}
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-1.5">
          {!isRunning && !isPaused ? (
            <button
              onClick={handleStart}
              disabled={timeRemaining === 0}
              className="flex-1 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-[11px] font-semibold py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start
            </button>
          ) : (
            <>
              <button
                onClick={isPaused ? handleStart : handlePause}
                className="flex-1 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-[11px] font-semibold py-1.5 transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 text-[11px] font-semibold py-1.5 transition-colors"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Monthly Progress Heatmap */}
      <div className="mt-1 space-y-2 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-[0.18em]">
            {getCurrentMonthName()} Progress
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
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 px-3 py-3 flex flex-col">
          <div className="space-y-1">
            {/* Day labels */}
            <div className="flex gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className="flex-1 text-center text-[10px] text-slate-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="space-y-1">
              {isLoadingHeatmap ? (
                <div className="flex items-center justify-center py-8 text-xs text-slate-500">
                  Loading heatmap...
                </div>
              ) : (
                getHeatmapGrid().map((week, weekIdx) => {
                  const todayPos = getTodayPosition();
                  return (
                    <div key={weekIdx} className="flex gap-1">
                      {week.map((value, dayIdx) => {
                        const isToday = weekIdx === todayPos.weekIdx && dayIdx === todayPos.dayIdx;
                        const isValid = value >= 0; // -1 means future date
                        const intensity = value <= 0 ? 0 : value >= 12 ? 4 : value >= 9 ? 3 : value >= 6 ? 2 : 1;
                        
                        return (
                          <div
                            key={dayIdx}
                            className={`flex-1 aspect-square rounded transition-all duration-200 ${
                              !isValid
                                ? 'bg-transparent'
                                : isToday
                                ? 'ring-2 ring-emerald-400/60 ring-offset-1 ring-offset-slate-900 bg-emerald-500/' + (intensity === 0 ? '20' : intensity === 1 ? '30' : intensity === 2 ? '50' : intensity === 3 ? '70' : '100')
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
                            title={isValid && value > 0 ? `${value} tasks completed` : isValid && value === 0 ? 'No tasks completed' : ''}
                          />
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Summary stats */}
          <div className="mt-2 pt-2 border-t border-slate-800/90 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.12em]">
                This Month
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">
                {isLoadingHeatmap ? '...' : `${getTotalMonthlyTasks()} tasks`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.12em]">
                Current Streak
              </div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                {isLoadingHeatmap ? '...' : `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControlHub;