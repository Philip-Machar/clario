import { ReactNode } from 'react';

interface ActionZoneProps {
  children: ReactNode;
}

/**
 * Action Zone - Top 60% of main content
 * Houses interactive task management and mentor chat
 * Responsive: stacks on mobile, side-by-side on desktop
 */
const ActionZone = ({ children }: ActionZoneProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 p-4 lg:p-6 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ActionZone;
