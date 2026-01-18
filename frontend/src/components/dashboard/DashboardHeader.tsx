import { FC } from 'react';
import { User } from '../../types';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 pt-3 sm:pt-4 pb-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-[10px] sm:text-xs font-semibold tracking-widest">
          CL
        </div>
        <div>
          <div className="text-[10px] sm:text-sm uppercase tracking-[0.20em] sm:tracking-[0.25em] text-slate-500">
            Workspace
          </div>
          <div className="text-sm sm:text-lg font-semibold text-slate-100">
            Clario Studio
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <div className="hidden sm:flex flex-col items-end text-xs text-slate-400">
          <span className="font-medium text-slate-200">
            {user?.username}
          </span>
          <span className="hidden md:block">{user?.email}</span>
        </div>
        <button
          onClick={onLogout}
          className="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:border-slate-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;

