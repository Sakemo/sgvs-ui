// src/pages/SettingsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { updateGeneralSettings } from '../api/services/settings.service';
import type { GeneralSettingsRequest } from '../api/types/domain';
import StockControlSettings from '../components/features/settings/StockControlSettings';
import Button from '../components/common/ui/Button';
import { LuSave } from 'react-icons/lu';
import { useSettings } from '../contexts/utils/UseSettings';
import { notificationService } from '../lib/notification.service';
import AccountSettings from '../components/features/settings/AccountSettings';
import Select from '../components/common/ui/Select';
import Card from '../components/common/ui/Card';
import { useTheme } from '../contexts/utils/UseTheme';
import type { Theme } from '../contexts/ThemeContext';
import ToggleSwitch from '../components/common/ui/ToggleSwitch';
import ShortcutRecorder from '../components/features/settings/ShortcutRecorder';
import useShortcutAction from '../hooks/useShortcutAction';
import {
  DEFAULT_SHORTCUT_PREFERENCES,
  formatShortcutBinding,
  getShortcutBindingConflicts,
  SHORTCUT_ACTIONS_BY_CATEGORY,
  SHORTCUT_ACTION_DEFINITIONS,
  SHORTCUT_CATEGORY_LABEL_KEYS,
  SHORTCUT_CATEGORY_ORDER,
  type ShortcutActionId,
  type ShortcutPreferences,
} from '../lib/keyboardShortcuts';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const {
    settings: initialSettings,
    isLoading,
    refetchSettings,
    shortcutPreferences,
    updateShortcutPreferences,
  } = useSettings();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState<Partial<GeneralSettingsRequest>>({});
  const [language, setLanguage] = useState<'pt' | 'en'>('en');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const [isSaving, setIsSaving] = useState(false);
  const [shortcutDraft, setShortcutDraft] = useState<ShortcutPreferences>(shortcutPreferences);

  useEffect(() => {
    if(initialSettings) {
      setFormData(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    setLanguage(i18n.resolvedLanguage?.startsWith('pt') ? 'pt' : 'en');
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  useEffect(() => {
    setShortcutDraft(shortcutPreferences);
  }, [shortcutPreferences]);

  const hasSettingsChanges =
    JSON.stringify(initialSettings) !== JSON.stringify({ ...initialSettings, ...formData });
  const currentLanguage = i18n.resolvedLanguage?.startsWith('pt') ? 'pt' : 'en';
  const hasLanguageChanges = language !== currentLanguage;
  const hasThemeChanges = selectedTheme !== theme;
  const hasShortcutChanges =
    JSON.stringify(shortcutPreferences) !== JSON.stringify(shortcutDraft);
  const shortcutConflicts = useMemo(
    () => getShortcutBindingConflicts(shortcutDraft.bindings),
    [shortcutDraft.bindings]
  );
  const hasShortcutConflicts = Object.values(shortcutConflicts).some(
    (conflicts) => conflicts && conflicts.length > 0
  );
  const isDirty =
    hasSettingsChanges || hasLanguageChanges || hasThemeChanges || hasShortcutChanges;
  const saveShortcutLabel = formatShortcutBinding(
    shortcutPreferences.bindings['settings.save']
  );

  const handleFormChange = (updatedValues: Partial<GeneralSettingsRequest>) => {
    setFormData(prev => ({ ...prev, ...updatedValues }));
  };

  const handleShortcutBindingChange = (
    actionId: ShortcutActionId,
    nextBinding: string
  ) => {
    setShortcutDraft((previous) => ({
      ...previous,
      bindings: {
        ...previous.bindings,
        [actionId]: nextBinding,
      },
    }));
  };

  const handleSave = async () => {
    if (!isDirty) return;
    if (hasShortcutConflicts) {
      notificationService.error(t('settings.keyboard.saveConflict'));
      return;
    }

    setIsSaving(true);
    try {
      if (hasSettingsChanges) {
        const payload = formData as GeneralSettingsRequest;
        const updatedSettings = await updateGeneralSettings(payload);
        refetchSettings();
        setFormData(updatedSettings);
      }

      if (hasLanguageChanges) {
        await i18n.changeLanguage(language);
        localStorage.setItem('i18nextLng', language);
      }

      if (hasThemeChanges) {
        setTheme(selectedTheme);
      }

      if (hasShortcutChanges) {
        updateShortcutPreferences(shortcutDraft);
      }

      notificationService.success(t('settings.saveSuccess'));

    } catch {
      notificationService.error(t('errors.saveSettings'));
    } finally {
      setIsSaving(false);
    }
  };

  useShortcutAction('settings.save', handleSave, {
    enabled: isDirty && !isSaving,
    allowInEditable: true,
    allowInInteractive: true,
  });

  if (isLoading) {
    return <p>{t('common.loading')}</p>;
  }
  return (
    <div className="space-y-6 p-2">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold dark:text-gray-200">{t('settings.pageTitle')}</h1>
        <Button onClick={handleSave} disabled={!isDirty || isSaving} isLoading={isSaving} iconLeft={<LuSave />} title={saveShortcutLabel ? `${t('actions.saveChanges')} (${saveShortcutLabel})` : undefined}>
          {t('actions.saveChanges')}
        </Button>
      </header>

      <main className="space-y-6">
        {initialSettings && (
          <StockControlSettings
            currentSelection={formData.stockControlType!}
            onChange={(value) => handleFormChange({ stockControlType: value })}
            disabled={isSaving}
          />
        )}
        <Card>
          <h2 className="mb-2 text-lg font-semibold">{t('settings.interface.title')}</h2>
          <p className="mb-4 text-sm text-text-secondary">{t('settings.interface.description')}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label={t('settings.language.label')}
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
              disabled={isSaving}
            >
              <option value="pt">{t('sidebar.portuguese')}</option>
              <option value="en">{t('sidebar.english')}</option>
            </Select>
            <Select
              label={t('settings.theme.label')}
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as Theme)}
              disabled={isSaving}
            >
              <option value="light">{t('settings.theme.light')}</option>
              <option value="dark">{t('settings.theme.dark')}</option>
            </Select>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{t('settings.keyboard.title')}</h2>
              <p className="text-sm text-text-secondary">
                {t('settings.keyboard.description')}
              </p>
              <p className="text-xs text-text-secondary/80">
                {t('settings.keyboard.sequenceHint')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShortcutDraft(DEFAULT_SHORTCUT_PREFERENCES)}
                disabled={isSaving}
              >
                {t('settings.keyboard.resetButton')}
              </Button>
              <ToggleSwitch
                enabled={shortcutDraft.enabled}
                onChange={(enabled) =>
                  setShortcutDraft((previous) => ({ ...previous, enabled }))
                }
                label={t('settings.keyboard.enableLabel')}
              />
            </div>
          </div>

          {hasShortcutConflicts && (
            <div className="mt-4 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
              {t('settings.keyboard.conflictBanner')}
            </div>
          )}

          <div className="mt-6 space-y-6">
            {SHORTCUT_CATEGORY_ORDER.map((category) => (
              <section key={category} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-dark-secondary">
                  {t(SHORTCUT_CATEGORY_LABEL_KEYS[category])}
                </h3>
                <div className="space-y-3">
                  {SHORTCUT_ACTIONS_BY_CATEGORY[category].map((actionId) => {
                    const definition = SHORTCUT_ACTION_DEFINITIONS[actionId];
                    const firstConflict = shortcutConflicts[actionId]?.[0];

                    return (
                      <div
                        key={actionId}
                        className="flex flex-col gap-4 rounded-card border border-border-light p-4 dark:border-border-dark-subtle lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-text-primary dark:text-text-dark-primary">
                            {t(definition.labelKey)}
                          </p>
                          {definition.descriptionKey && (
                            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                              {t(definition.descriptionKey)}
                            </p>
                          )}
                          {firstConflict && (
                            <p className="text-xs text-red-600 dark:text-red-300">
                              {t('settings.keyboard.conflictMessage', {
                                action: t(
                                  SHORTCUT_ACTION_DEFINITIONS[firstConflict.actionId].labelKey
                                ),
                                shortcut:
                                  formatShortcutBinding(
                                    shortcutDraft.bindings[firstConflict.actionId]
                                  ) || shortcutDraft.bindings[firstConflict.actionId],
                              })}
                            </p>
                          )}
                        </div>
                        <ShortcutRecorder
                          value={shortcutDraft.bindings[actionId]}
                          onChange={(nextBinding) =>
                            handleShortcutBindingChange(actionId, nextBinding)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </Card>
        <AccountSettings />
      </main>
    </div>
  );
};

export default SettingsPage;
