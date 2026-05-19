import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  LuChevronsLeft,
  LuChevronsRight,
  LuLayoutDashboard,
  LuPackage,
  LuTruck,
  LuUsers,
  LuShoppingCart,
  LuDollarSign,
  LuSettings,
  LuChartBar,
} from 'react-icons/lu';
import { type IconType } from 'react-icons';

interface NavItem {
  path: string;
  labelKey: string;
  icon: IconType;
}

interface NavGroup {
  groupLabelKey: string;
  children: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { t } = useTranslation();

  const mainNavItems: (NavItem | NavGroup)[] = [
    {
      groupLabelKey: 'sidebar.groups.overview',
      children: [
        { path: '/dashboard', labelKey: 'sidebar.dashboard', icon: LuLayoutDashboard },
        { path: '/reports', labelKey: 'sidebar.reports', icon: LuChartBar },
      ],
    },
    {
      groupLabelKey: 'sidebar.groups.finance',
      children: [
        { path: '/sales', labelKey: 'sidebar.sales', icon: LuShoppingCart },
        { path: '/expenses', labelKey: 'sidebar.expenses', icon: LuDollarSign },
      ],
    },
    {
      groupLabelKey: 'sidebar.groups.operations',
      children: [
        { path: '/products', labelKey: 'sidebar.products', icon: LuPackage },
        { path: '/providers', labelKey: 'sidebar.providers', icon: LuTruck },
        { path: '/customers', labelKey: 'sidebar.customers', icon: LuUsers },
      ],
    },
  ];

  const footerNavItem: NavItem = {
    path: '/settings', labelKey: 'sidebar.settings', icon: LuSettings,
  };

  const linkBaseClasses = 'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors duration-150';
  const iconOnlyLinkClasses = 'mx-auto h-11 w-11 justify-center gap-0 px-0';
  const linkInactiveClasses = 'text-text-secondary hover:bg-brand-primary/8 hover:text-text-primary dark:text-[#D7CEC8] dark:hover:bg-brand-primary/14 dark:hover:text-[#F7F1ED]';
  const linkActiveClasses = 'bg-brand-primary/12 text-[#2E6430] dark:bg-brand-primary/18 dark:text-[#F7F1ED] font-semibold';

  return (
    <aside
      className={clsx(
        'flex flex-shrink-0 flex-col overflow-hidden border-r border-border-light bg-card-light transition-[width] duration-200 dark:border-border-dark dark:bg-card-dark',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="border-b border-border-light p-4 dark:border-border-dark">
        <div className={clsx('flex items-center', isCollapsed ? 'justify-center' : 'justify-between gap-3')}>
          {!isCollapsed && (
            <h1 className="truncate text-xl font-bold text-text-primary dark:text-[#F7F1ED]">
              flick.business
            </h1>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            title={t(isCollapsed ? 'sidebar.expand' : 'sidebar.collapse')}
            aria-label={t(isCollapsed ? 'sidebar.expand' : 'sidebar.collapse')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-text-secondary transition-colors duration-150 hover:bg-brand-primary/8 hover:text-text-primary dark:text-[#D7CEC8] dark:hover:bg-brand-primary/14 dark:hover:text-[#F7F1ED]"
          >
            {isCollapsed ? <LuChevronsRight className="h-5 w-5" /> : <LuChevronsLeft className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <nav className={clsx('flex-1 p-4', isCollapsed ? 'space-y-3' : 'space-y-4')}>
        {mainNavItems.map((item) => (
          'groupLabelKey' in item ? (
            <div key={item.groupLabelKey}>
              {!isCollapsed && (
                <div className="mb-1 px-3 text-xs font-semibold uppercase text-text-secondary dark:text-[#B7AAA2]">
                  {t(item.groupLabelKey)}
                </div>
              )}
              <div className="space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    end={child.path === '/'}
                    title={t(child.labelKey)}
                    aria-label={t(child.labelKey)}
                    className={({ isActive }) =>
                      clsx(
                        linkBaseClasses,
                        isCollapsed && iconOnlyLinkClasses,
                        isActive ? linkActiveClasses : linkInactiveClasses
                      )
                    }
                  >
                    <child.icon className="h-5 w-5 flex-shrink-0" />
                    <span className={clsx(isCollapsed && 'sr-only')}>{t(child.labelKey)}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                clsx(linkBaseClasses, isCollapsed && iconOnlyLinkClasses, isActive ? linkActiveClasses : linkInactiveClasses)
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={clsx(isCollapsed && 'sr-only')}>{t(item.labelKey)}</span>
            </NavLink>
          )
        ))}
      </nav>
      
      <div className="border-t border-border-light p-4 dark:border-border-dark">
        <NavLink
          to={footerNavItem.path}
          title={t(footerNavItem.labelKey)}
          aria-label={t(footerNavItem.labelKey)}
          className={({ isActive }) =>
            clsx(
              linkBaseClasses,
              isCollapsed && iconOnlyLinkClasses,
              isActive ? linkActiveClasses : linkInactiveClasses
            )
          }
        >
          <footerNavItem.icon className="h-5 w-5 flex-shrink-0" />
          <span className={clsx(isCollapsed && 'sr-only')}>{t(footerNavItem.labelKey)}</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
