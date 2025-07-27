import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  LuLayoutDashboard,
  LuPackage,
  LuUsers,
  LuShoppingCart,
  LuDollarSign,
  LuSettings,
  LuChartBar,
  LuChevronDown,
  LuChevronRight
} from 'react-icons/lu';
import { type IconType } from 'react-icons';
import ThemeToggleButton from './common/ThemeToggleButton';

interface NavItem {
  path: string;
  labelKey: string; 
  defaultLabel: string;
  icon: IconType;
}

interface NavGroup {
  groupLabel: string;
  icon?: IconType;
  children: NavItem[];
}

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupLabel: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupLabel]: !prev[groupLabel],
    }));
  };

  const mainNavItems: (NavItem | NavGroup)[] = [
    {
      groupLabel: 'Overview',
      children: [
        { path: '/', labelKey: 'sidebar.dashboard', defaultLabel: 'Dashboard', icon: LuLayoutDashboard },
        { path: '/reports', labelKey: 'sidebar.reports', defaultLabel: 'Reports', icon: LuChartBar },
      ],
    },
    {
      groupLabel: 'Finance',
      children: [
        { path: '/sales', labelKey: 'sidebar.sales', defaultLabel: 'Sales', icon: LuShoppingCart },
        { path: '/expenses', labelKey: 'sidebar.expenses', defaultLabel: 'Expenses', icon: LuDollarSign },
      ],
    },
    {
      groupLabel: 'Operations',
      children: [
        { path: '/products', labelKey: 'sidebar.products', defaultLabel: 'Products', icon: LuPackage },
        { path: '/customers', labelKey: 'sidebar.customers', defaultLabel: 'Customers', icon: LuUsers },
      ],
    },
  ];
  
  const footerNavItem: NavItem = {
    path: '/settings', labelKey: 'sidebar.settings', defaultLabel: 'Settings', icon: LuSettings,
  };

  const linkBaseClasses = 'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors duration-150';
  const linkInactiveClasses = 'text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white';
  const linkActiveClasses = 'bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/10 dark:text-brand-accent font-semibold';

  const childLinkBaseClasses = 'flex items-center gap-2 pr-3 py-2 rounded-btn text-sm transition-colors duration-150';
  const childLinkInactiveClasses = 'text-text-secondary hover:bg-gray-100 hover:text-text-primary dark-text-gray-300 dark:hover:bg-white/5 dark:hover:text-white';
  const childLinkActiveClasses = 'bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/10 dark:text-brand-accent font-semibold';
  
  return (
    <aside className="w-64 flex-shrink-0 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col">
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <h1 className="text-xl font-bold text-text-primary dark:text-white text-center">
          SGVS<span className="text-brand-primary">.</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
        {mainNavItems.map((item, idx) =>
          'groupLabel' in item ? (
            <div key={`group-${idx}`}>
              <div
                onClick={() => toggleGroup(item.groupLabel)}
                className={clsx(
                  linkBaseClasses,
                  'cursor-pointer',
                  openGroups[item.groupLabel] ? linkActiveClasses : linkInactiveClasses
                )}
              >
                <span className = "text-base">{item.groupLabel}</span>
                {openGroups[item.groupLabel] ? (
                  <LuChevronDown className="ml-auto h-4 w-4 opacity-60" />
                ) : (
                  <LuChevronRight className="ml-auto h-4 w-4 opacity-60" />
                )}
              </div>

              {openGroups[item.groupLabel] &&
                item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    end={child.path === '/'}
                    className={({ isActive }) =>
                      clsx(childLinkBaseClasses, isActive ? childLinkActiveClasses : childLinkInactiveClasses)
                    }
                  >
                    <child.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{t(child.labelKey, child.defaultLabel)}</span>
                  </NavLink>
                ))}
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                clsx(linkBaseClasses, isActive ? linkActiveClasses : linkInactiveClasses)
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{t(item.labelKey, item.defaultLabel)}</span>
            </NavLink>
          )
        )}
      </nav>
      
      <div className="p-2 border-t border-border-light dark:border-border-dark">
        <div className='flex items-center justify-between mt-2'>
          <ThemeToggleButton />
        </div>
        <NavLink
            to={footerNavItem.path}
            className={({ isActive }) =>
              clsx(linkBaseClasses, isActive ? linkActiveClasses : linkInactiveClasses)
            }
          >
            <footerNavItem.icon className="h-5 w-5 flex-shrink-0" />
            <span>{t(footerNavItem.labelKey, footerNavItem.defaultLabel)}</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;