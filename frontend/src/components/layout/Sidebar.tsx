import { FC } from 'react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

/**
 * Left navigation sidebar - clean, minimal, purposeful
 * Separated into Action Zone (top) and Data Zone (bottom) sections
 */
const Sidebar: FC = () => {
  const { logout } = useAuth();

  const actionZoneItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '▣', active: true },
    { id: 'tasks', label: 'Tasks', icon: '◉' },
    { id: 'calendar', label: 'Calendar', icon: '◈' },
    { id: 'history', label: 'History', icon: '◊' },
    { id: 'settings', label: 'Settings', icon: '◐' },
  ];

  const dataZoneItems: NavItem[] = [
    { id: 'notifications', label: 'Notifications', icon: '◉' },
    { id: 'help', label: 'Help', icon: '?' },
  ];

  return (
    <aside className="hidden md:flex w-20 lg:w-24 bg-bg-secondary border-r border-border-subtle flex-col">
      {/* Logo Section */}
      <div className="h-20 lg:h-24 flex items-center justify-center border-b border-border-subtle">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xl font-bold text-white">
          C
        </div>
      </div>

      {/* Action Zone Navigation */}
      <nav className="flex-1 py-6 flex flex-col items-center gap-2">
        {actionZoneItems.map((item) => (
          <button
            key={item.id}
            className={`
              w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${item.active
                ? 'bg-accent-subtle border border-border-accent text-accent'
                : 'text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary'
              }
            `}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-px bg-border-subtle mx-4" />

      {/* Data Zone Navigation */}
      <nav className="py-6 flex flex-col items-center gap-2">
        {dataZoneItems.map((item) => (
          <button
            key={item.id}
            className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200"
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}
        
        {/* User Profile / Logout */}
        <button
          onClick={logout}
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200 mt-4"
          title="Logout"
        >
          <span className="text-xl">→</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
