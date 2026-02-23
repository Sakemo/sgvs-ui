import React from 'react';
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
} from 'react-icons/lu';
import { type IconType } from 'react-icons';
import ThemeToggleButton from './common/ThemeToggleButton';

interface NavItem {
  path: string;
  labelKey: string;
  icon: IconType;
}

interface NavGroup {
  groupLabelKey: string;
  children: NavItem[];
}

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage?.startsWith('pt') ? 'pt' : 'en';

  const mainNavItems: (NavItem | NavGroup)[] = [
    {
      groupLabelKey: 'sidebar.groups.overview',
      children: [
        { path: '/', labelKey: 'sidebar.dashboard', icon: LuLayoutDashboard },
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
        { path: '/customers', labelKey: 'sidebar.customers', icon: LuUsers },
      ],
    },
  ];
  
  const footerNavItem: NavItem = {
    path: '/settings', labelKey: 'sidebar.settings', icon: LuSettings,
  };

  const linkBaseClasses = 'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors duration-150';
  const linkInactiveClasses = 'text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white';
  const linkActiveClasses = 'text-brand-primary bg-brand-primary/10  dark:bg-brand-primary/10 dark:text-brand-accent font-semibold';
  const languageButtonBaseClasses =
    'px-3 py-1.5 text-xs rounded-btn border transition-colors duration-150';
  const languageButtonActiveClasses =
    'bg-brand-primary text-white border-brand-primary dark:bg-brand-primary dark:text-white dark:border-brand-primary';
  const languageButtonInactiveClasses =
    'bg-transparent text-text-secondary border-border-light hover:text-text-primary hover:border-brand-primary dark:text-gray-300 dark:border-border-dark dark:hover:text-white dark:hover:border-brand-primary';

  return (
    <aside className="w-64 flex-shrink-0 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col">
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <h1 className="text-xl font-bold text-text-primary dark:text-white text-center">
          SGVS<span className="text-brand-primary">.</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-4">
        {mainNavItems.map((item) => (
          'groupLabelKey' in item ? (
            <div key={item.groupLabelKey}>
              <div className="px-3 text-xs uppercase text-text-secondary dark:text-gray-400 font-semibold mb-1">
                {t(item.groupLabelKey)}
              </div>
              <div className="space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    end={child.path === '/'}
                    className={({ isActive }) =>
                      clsx(
                        linkBaseClasses,
                        isActive ? linkActiveClasses : linkInactiveClasses
                      )
                    }
                  >
                    <child.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{t(child.labelKey)}</span>
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
                clsx(linkBaseClasses, isActive ? linkActiveClasses : linkInactiveClasses)
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          )
        ))}
      </nav>
      
      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <ThemeToggleButton />
        <div className="mt-4">
          <p className="px-1 text-xs uppercase text-text-secondary dark:text-gray-400 font-semibold mb-2">
            {t('sidebar.language')}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i18n.changeLanguage('pt')}
              className={clsx(
                languageButtonBaseClasses,
                currentLanguage === 'pt' ? languageButtonActiveClasses : languageButtonInactiveClasses
              )}
            >
              {t('sidebar.portuguese')}
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('en')}
              className={clsx(
                languageButtonBaseClasses,
                currentLanguage === 'en' ? languageButtonActiveClasses : languageButtonInactiveClasses
              )}
            >
              {t('sidebar.english')}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <NavLink
            to={footerNavItem.path}
            className={({ isActive }) =>
              clsx(linkBaseClasses, isActive ? linkActiveClasses : linkInactiveClasses)
            }
          >
            <footerNavItem.icon className="h-5 w-5 flex-shrink-0" />
            <span>{t(footerNavItem.labelKey)}</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
