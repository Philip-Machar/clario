import { ReactNode } from 'react';

interface DataZoneProps {
  children: ReactNode;
}

/**
 * Data Zone - Bottom 40% of main content
 * Displays analytical and motivational data: Focus Timer, Weekly Focus, Streak Matrix
 * Responsive: stacks on mobile, 3 columns on desktop
 */
const DataZone = ({ children }: DataZoneProps) => {
  return (
    <div className="h-[40vh] min-h-[400px] max-h-[500px] border-t border-border-subtle bg-bg-secondary overflow-hidden">
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DataZone;
