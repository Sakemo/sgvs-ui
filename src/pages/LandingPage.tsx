import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LuArrowRight,
  LuChartBar,
  LuDollarSign,
  LuLayoutDashboard,
  LuPackage,
  LuShoppingCart,
  LuTruck,
  LuUsers,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import ThemeToggleButton from "../components/layout/common/ThemeToggleButton";
import { useAuth } from "../contexts/AuthContext";

interface FeatureItem {
  icon: IconType;
  title: string;
  description: string;
}

interface ModuleItem {
  icon: IconType;
  label: string;
  description: string;
}

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const featureItems: FeatureItem[] = [
    {
      icon: LuLayoutDashboard,
      title: t("landing.features.dashboard.title"),
      description: t("landing.features.dashboard.description"),
    },
    {
      icon: LuPackage,
      title: t("landing.features.inventory.title"),
      description: t("landing.features.inventory.description"),
    },
    {
      icon: LuUsers,
      title: t("landing.features.customers.title"),
      description: t("landing.features.customers.description"),
    },
    {
      icon: LuChartBar,
      title: t("landing.features.reports.title"),
      description: t("landing.features.reports.description"),
    },
  ];

  const moduleItems: ModuleItem[] = [
    {
      icon: LuShoppingCart,
      label: t("sidebar.sales"),
      description: t("landing.modules.sales"),
    },
    {
      icon: LuPackage,
      label: t("sidebar.products"),
      description: t("landing.modules.products"),
    },
    {
      icon: LuTruck,
      label: t("sidebar.providers"),
      description: t("landing.modules.providers"),
    },
    {
      icon: LuUsers,
      label: t("sidebar.customers"),
      description: t("landing.modules.customers"),
    },
    {
      icon: LuDollarSign,
      label: t("sidebar.expenses"),
      description: t("landing.modules.expenses"),
    },
    {
      icon: LuChartBar,
      label: t("sidebar.reports"),
      description: t("landing.modules.reports"),
    },
  ];

  const previewBars = ["w-[92%]", "w-[78%]", "w-[86%]", "w-[70%]"];

  const primaryLinkClasses =
    "inline-flex items-center justify-center gap-2 rounded-btn bg-brand-primary px-5 py-3 text-sm font-semibold text-[#1E1E1E] shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-accent hover:text-[#F7F1ED] dark:bg-accent-dark-green dark:text-text-primary dark:hover:bg-brand-primary dark:hover:text-text-primary";
  const secondaryLinkClasses =
    "inline-flex items-center justify-center gap-2 rounded-btn border border-border-light bg-card-light px-5 py-3 text-sm font-semibold text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:bg-brand-primary/8 dark:border-border-dark-subtle dark:bg-card-dark dark:text-text-dark-primary dark:hover:border-accent-dark-green/40 dark:hover:bg-bg-dark-tertiary";

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-light text-text-primary transition-colors duration-200 dark:bg-bg-dark dark:text-text-dark-primary">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-4rem] h-72 w-72 rounded-full bg-brand-primary/16 blur-3xl dark:bg-accent-dark-green/18" />
        <div className="absolute bottom-[-5rem] right-[-6rem] h-80 w-80 rounded-full bg-[#D7EBCF] blur-3xl dark:bg-[#17342C] dark:opacity-90" />
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-gradient-to-b from-card-light/60 via-transparent to-transparent dark:from-card-dark/30" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-text-primary transition-colors hover:text-brand-accent dark:text-text-dark-primary dark:hover:text-accent-dark-green"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-primary/20 bg-card-light text-lg font-bold shadow-soft dark:border-accent-dark-green/30 dark:bg-card-dark">
              fb
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-text-secondary dark:text-text-dark-secondary">
                flick.business
              </p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                {t("landing.badge")}
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggleButton />
            {isAuthenticated ? (
              <Link to="/dashboard" className={primaryLinkClasses}>
                {t("landing.cta.dashboard")}
                <LuArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className={secondaryLinkClasses}>
                  {t("auth.login.submit")}
                </Link>
                <Link to="/register" className={primaryLinkClasses}>
                  {t("landing.cta.register")}
                  <LuArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="flex-1">
          <section className="grid gap-10 pb-16 pt-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-24 lg:pt-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-card-light/90 px-4 py-2 text-sm font-medium text-text-secondary shadow-soft backdrop-blur dark:border-accent-dark-green/25 dark:bg-card-dark/90 dark:text-text-dark-secondary">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-primary dark:bg-accent-dark-green" />
                {t("landing.hero.eyebrow")}
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  {t("landing.hero.title")}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-text-secondary dark:text-text-dark-secondary">
                  {t("landing.hero.description")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {isAuthenticated ? (
                  <Link to="/dashboard" className={primaryLinkClasses}>
                    {t("landing.cta.dashboard")}
                    <LuArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className={secondaryLinkClasses}>
                      {t("landing.cta.primary")}
                    </Link>
                    <Link to="/register" className={primaryLinkClasses}>
                      {t("landing.cta.secondary")}
                      <LuArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>

              <ul className="grid gap-3 text-sm text-text-secondary dark:text-text-dark-secondary sm:grid-cols-3">
                <li className="border border-border-light/90 bg-card-light/85 px-4 py-4 shadow-soft dark:border-border-dark-subtle dark:bg-card-dark/85">
                  {t("landing.hero.bullets.sales")}
                </li>
                <li className="border border-border-light/90 bg-card-light/85 px-4 py-4 shadow-soft dark:border-border-dark-subtle dark:bg-card-dark/85">
                  {t("landing.hero.bullets.stock")}
                </li>
                <li className="border border-border-light/90 bg-card-light/85 px-4 py-4 shadow-soft dark:border-border-dark-subtle dark:bg-card-dark/85">
                  {t("landing.hero.bullets.insights")}
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-x-10 top-10 -z-10 h-64 rounded-full bg-brand-primary/18 blur-3xl dark:bg-accent-dark-green/20" />
              <div className="">
                <div className="flex items-start justify-between gap-4 border-b border-border-light/90 pb-5 dark:border-border-dark-subtle">
                  <div>
                    <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
                      {t("landing.preview.eyebrow")}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {t("landing.preview.title")}
                    </h2>
                  </div>
                  <span className="rounded-full bg-brand-primary/12 px-3 py-1 text-xs font-semibold text-[#2E6430] dark:bg-accent-dark-green/18 dark:text-accent-dark-green">
                    {t("landing.preview.live")}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border-light/80 bg-bg-light/80 p-4 dark:border-border-dark-subtle dark:bg-bg-dark-secondary/80">
                    <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
                      {t("landing.preview.cards.sales.title")}
                    </p>
                    <p className="mt-3 text-xl font-semibold">
                      {t("landing.preview.cards.sales.value")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-dark-secondary">
                      {t("landing.preview.cards.sales.detail")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border-light/80 bg-bg-light/80 p-4 dark:border-border-dark-subtle dark:bg-bg-dark-secondary/80">
                    <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
                      {t("landing.preview.cards.stock.title")}
                    </p>
                    <p className="mt-3 text-xl font-semibold">
                      {t("landing.preview.cards.stock.value")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-dark-secondary">
                      {t("landing.preview.cards.stock.detail")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border-light/80 bg-bg-light/80 p-4 dark:border-border-dark-subtle dark:bg-bg-dark-secondary/80">
                    <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
                      {t("landing.preview.cards.finance.title")}
                    </p>
                    <p className="mt-3 text-xl font-semibold">
                      {t("landing.preview.cards.finance.value")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-dark-secondary">
                      {t("landing.preview.cards.finance.detail")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-border-light/80 bg-bg-light/70 p-5 dark:border-border-dark-subtle dark:bg-bg-dark-secondary/70">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold">
                        {t("landing.preview.listTitle")}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">
                        {t("landing.preview.listDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {moduleItems.slice(0, 4).map((item, index) => (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-accent dark:bg-accent-dark-green/14 dark:text-accent-dark-green">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold">
                              {item.label}
                            </p>
                            <span className="text-xs text-text-secondary dark:text-text-dark-secondary">
                              {t("landing.preview.connected")}
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-primary/10 dark:bg-accent-dark-green/14">
                            <div
                              className={`h-full rounded-full bg-brand-primary dark:bg-accent-dark-green ${previewBars[index]}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-16 lg:pb-20">
            <div className="mb-6 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary dark:text-text-dark-secondary">
                {t("landing.features.eyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                {t("landing.features.title")}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featureItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-border-light bg-card-light p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-card dark:border-border-dark-subtle dark:bg-card-dark dark:hover:border-border-dark dark:hover:bg-card-dark-hover"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/12 text-brand-accent dark:bg-accent-dark-green/14 dark:text-accent-dark-green">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary dark:text-text-dark-secondary">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-16 lg:pb-20">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-border-light bg-card-light p-8 shadow-soft dark:border-border-dark-subtle dark:bg-card-dark">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary dark:text-text-dark-secondary">
                  {t("landing.modules.eyebrow")}
                </p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  {t("landing.modules.title")}
                </h2>
                <p className="mt-4 text-base leading-8 text-text-secondary dark:text-text-dark-secondary">
                  {t("landing.modules.description")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {moduleItems.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-[1.5rem] border border-border-light bg-card-light p-5 shadow-soft dark:border-border-dark-subtle dark:bg-card-dark"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/12 text-brand-accent dark:bg-accent-dark-green/14 dark:text-accent-dark-green">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{item.label}</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary dark:text-text-dark-secondary">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="pb-16">
            <div className="rounded-[2rem] border border-brand-primary/20 bg-gradient-to-br from-card-light via-card-light to-[#E4F0DE] p-8 shadow-card dark:border-accent-dark-green/20 dark:from-card-dark dark:via-card-dark dark:to-card-dark-accent sm:p-10">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary dark:text-text-dark-secondary">
                  {t("landing.finalCta.eyebrow")}
                </p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  {t("landing.finalCta.title")}
                </h2>
                <p className="mt-4 text-base leading-8 text-text-secondary dark:text-text-dark-secondary">
                  {t("landing.finalCta.description")}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {isAuthenticated ? (
                  <Link to="/dashboard" className={primaryLinkClasses}>
                    {t("landing.cta.dashboard")}
                    <LuArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className={secondaryLinkClasses}>
                      {t("landing.cta.primary")}
                    </Link>
                    <Link to="/register" className={primaryLinkClasses}>
                      {t("landing.cta.secondary")}
                      <LuArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
