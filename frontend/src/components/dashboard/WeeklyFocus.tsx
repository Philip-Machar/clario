import { FC } from 'react';

interface WeeklyFocusProps {
  data?: number[];
}

/**
 * WeeklyFocus - Weekly progress visualization
 * Shows focus time trends over the past week
 */
const WeeklyFocus: FC<WeeklyFocusProps> = ({ data }) => {
  // Mock data if not provided
  const weekData = data || [2.5, 3.2, 2.8, 4.1, 3.5, 3.9, 4.5];
  const maxValue = Math.max(...weekData, 5);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calculate percentage change (mock)
  const percentageChange = 10.97;

  return (
    <div className="surface-elevated flex flex-col h-full p-4 lg:p-6 min-h-[350px]">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-text-primary">Weekly Focus</h3>
          <span className="text-sm font-semibold text-accent">
            +{percentageChange.toFixed(2)}%
          </span>
        </div>
        <p className="text-body text-text-tertiary">Hours of focused work</p>
      </div>

      {/* Chart */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-end justify-between gap-2 h-40">
          {weekData.map((value, index) => {
            const height = (value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full rounded-t-lg bg-accent transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
              </div>
            );
          })}
        </div>
        
        {/* Day Labels */}
        <div className="flex justify-between mt-3">
          {days.map((day, index) => (
            <span
              key={index}
              className="text-xs text-text-muted flex-1 text-center"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-label text-text-muted mb-1">This Week</div>
            <div className="text-2xl font-semibold text-text-primary">
              {weekData.reduce((a, b) => a + b, 0).toFixed(1)}h
            </div>
          </div>
          <div className="text-right">
            <div className="text-label text-text-muted mb-1">Daily Avg</div>
            <div className="text-xl font-semibold text-text-primary">
              {(weekData.reduce((a, b) => a + b, 0) / 7).toFixed(1)}h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyFocus;
