import React from "react";
import { useTranslation } from "react-i18next";
import { LuArrowRight, LuBadgeCheck, LuPackage, LuShoppingCart, LuUsers } from "react-icons/lu";
import Modal from "../common/Modal";
import Button from "../common/ui/Button";

interface FirstLoginOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FirstLoginOnboardingModal: React.FC<FirstLoginOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: LuPackage,
      title: t("onboarding.steps.products.title"),
      description: t("onboarding.steps.products.description"),
    },
    {
      icon: LuUsers,
      title: t("onboarding.steps.customers.title"),
      description: t("onboarding.steps.customers.description"),
    },
    {
      icon: LuShoppingCart,
      title: t("onboarding.steps.sales.title"),
      description: t("onboarding.steps.sales.description"),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("onboarding.title")} className="sm:max-w-2xl">
      <div className="space-y-6">
        <div className="rounded-card border border-brand-primary/20 bg-brand-primary/8 p-4 dark:border-accent-dark-green/20 dark:bg-accent-dark-green/10">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center bg-brand-primary/15 text-brand-accent dark:bg-accent-dark-green/15 dark:text-accent-dark-green">
              <LuBadgeCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                {t("onboarding.subtitle")}
              </p>
              <p className="text-sm leading-6 text-text-secondary dark:text-text-dark-secondary">
                {t("onboarding.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-card border border-border-light bg-bg-light/70 p-4 shadow-soft dark:border-border-dark-subtle dark:bg-bg-dark-secondary/70"
            >
              <div className="flex h-11 w-11 items-center justify-center bg-brand-primary/12 text-brand-accent dark:bg-accent-dark-green/14 dark:text-accent-dark-green">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary dark:text-text-dark-secondary">
                {t("onboarding.stepLabel", { number: index + 1 })}
              </p>
              <h3 className="mt-2 text-base font-semibold text-text-primary dark:text-text-dark-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-dark-secondary">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-card border border-border-light bg-card-light p-4 dark:border-border-dark-subtle dark:bg-card-dark">
          <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
            {t("onboarding.tipTitle")}
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-dark-secondary">
            {t("onboarding.tipDescription")}
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} iconRight={<LuArrowRight />}>
            {t("onboarding.cta")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FirstLoginOnboardingModal;
