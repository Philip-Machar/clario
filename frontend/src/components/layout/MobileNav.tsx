import { FC } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * MobileNav - Bottom navigation bar for mobile devices
 * Provides access to key features when sidebar is hidden
 */
const MobileNav: FC = () => {
  const { logout } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle z-50">
      <div className="flex items-center justify-around h-16">
        <button className="flex flex-col items-center gap-1 text-accent">
          <span className="text-xl">▣</span>
          <span className="text-xs">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-text-tertiary">
          <span className="text-xl">◉</span>
          <span className="text-xs">Tasks</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-text-tertiary">
          <span className="text-xl">◈</span>
          <span className="text-xs">Calendar</span>
        </button>
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 text-text-tertiary"
        >
          <span className="text-xl">→</span>
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
