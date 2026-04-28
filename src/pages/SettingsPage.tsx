// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
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

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { settings: initialSettings, isLoading, refetchSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState<Partial<GeneralSettingsRequest>>({});
  const [language, setLanguage] = useState<'pt' | 'en'>('en');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const [isSaving, setIsSaving] = useState(false);

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

  const hasSettingsChanges =
    JSON.stringify(initialSettings) !== JSON.stringify({ ...initialSettings, ...formData });
  const currentLanguage = i18n.resolvedLanguage?.startsWith('pt') ? 'pt' : 'en';
  const hasLanguageChanges = language !== currentLanguage;
  const hasThemeChanges = selectedTheme !== theme;
  const isDirty = hasSettingsChanges || hasLanguageChanges || hasThemeChanges;

  const handleFormChange = (updatedValues: Partial<GeneralSettingsRequest>) => {
    setFormData(prev => ({ ...prev, ...updatedValues }));
  };

  const handleSave = async () => {
    if (!isDirty) return;

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

      notificationService.success(t('settings.saveSuccess'));

    } catch {
      notificationService.error(t('errors.saveSettings'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p>{t('common.loading')}</p>;
  }
  return (
    <div className="space-y-6 p-2">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold dark:text-gray-200">{t('settings.pageTitle')}</h1>
        <Button onClick={handleSave} disabled={!isDirty || isSaving} isLoading={isSaving} iconLeft={<LuSave />}>
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
        <AccountSettings />
      </main>
    </div>
  );
};

export default SettingsPage;
