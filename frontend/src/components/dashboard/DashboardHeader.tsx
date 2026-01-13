import { FC } from 'react';
import { User } from '../../types';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between px-10 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-xs font-semibold tracking-widest">
          CL
        </div>
        <div>
          <div className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Workspace
          </div>
          <div className="text-lg font-semibold text-slate-100">
            Clario Studio
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end text-xs text-slate-400">
          <span className="font-medium text-slate-200">
            {user?.username}
          </span>
          <span>{user?.email}</span>
        </div>
        <button
          onClick={onLogout}
          className="rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:border-slate-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;

