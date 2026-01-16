import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Main application shell - provides the foundational layout structure
 * Heavy, solid, engineered feel with clear separation of concerns
 * Responsive: sidebar on desktop, mobile nav on mobile
 */
const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left Navigation Sidebar (Desktop) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation (Mobile) */}
      <MobileNav />
    </div>
  );
};

export default AppShell;
