import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import LowStockPopup from '../features/dashboard/LowStockPopup';
import { KeyboardShortcutsRuntimeProvider } from '../../contexts/KeyboardShortcutsRuntimeProvider';
import KeyboardShortcutsHelpModal from './KeyboardShortcutsHelpModal';
import FirstLoginOnboardingModal from './FirstLoginOnboardingModal';
import { NAVIGATION_SHORTCUTS, type ShortcutActionId } from '../../lib/keyboardShortcuts';
import useShortcutAction from '../../hooks/useShortcutAction';
import { useKeyboardShortcuts } from '../../contexts/utils/UseKeyboardShortcuts';
import { useAuth } from '../../contexts/AuthContext';
import { hasSeenFirstLoginOnboarding, markFirstLoginOnboardingSeen } from '../../lib/onboarding';

const ShortcutRegistration: React.FC<{
  actionId: ShortcutActionId;
  onTrigger: () => void;
}> = ({ actionId, onTrigger }) => {
  useShortcutAction(actionId, onTrigger);
  return null;
};

const LayoutShortcutRegistrations: React.FC<{
  onToggleSidebar: () => void;
}> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { toggleHelp } = useKeyboardShortcuts();

  useShortcutAction('interface.toggleSidebar', onToggleSidebar);
  useShortcutAction('interface.showHelp', toggleHelp);

  return (
    <>
      {NAVIGATION_SHORTCUTS.map(({ actionId, path }) => (
        <ShortcutRegistration
          key={actionId}
          actionId={actionId}
          onTrigger={() => navigate(path)}
        />
      ))}
      <KeyboardShortcutsHelpModal />
    </>
  );
};

const MainLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsOnboardingOpen(false);
      return;
    }

    const alreadySeen = hasSeenFirstLoginOnboarding(user);
    setIsOnboardingOpen(!alreadySeen);
  }, [isAuthenticated, user]);

  const handleCloseOnboarding = () => {
    if (user) {
      markFirstLoginOnboardingSeen(user);
    }
    setIsOnboardingOpen(false);
  };

  return (
    <KeyboardShortcutsRuntimeProvider>
      <div className="flex h-screen bg-bg-light text-text-primary dark:bg-bg-dark">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
        <LowStockPopup />
        <FirstLoginOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={handleCloseOnboarding}
        />
        <LayoutShortcutRegistrations
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>
    </KeyboardShortcutsRuntimeProvider>
  );
};

export default MainLayout;
