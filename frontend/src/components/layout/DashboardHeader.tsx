import { FC } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard Header - Clean, minimal, confident
 * Displays workspace name and user info
 */
const DashboardHeader: FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 md:h-20 border-b border-border-subtle bg-bg-secondary flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary">
          Clario
        </h1>
        <span className="text-label text-text-muted hidden sm:inline">V3</span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-text-primary">
              {user.username}
            </span>
            <span className="text-xs text-text-muted">{user.email}</span>
          </div>
        )}
        <div className="w-10 h-10 rounded-xl bg-bg-tertiary border border-border-visible flex items-center justify-center">
          <span className="text-sm font-medium text-text-primary">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
