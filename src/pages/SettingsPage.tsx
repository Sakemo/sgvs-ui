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

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { settings: initialSettings, isLoading, refetchSettings } = useSettings();
  const [formData, setFormData] = useState<Partial<GeneralSettingsRequest>>({});
  const [language, setLanguage] = useState<'pt' | 'en'>('en');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if(initialSettings) {
      setFormData(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    setLanguage(i18n.resolvedLanguage?.startsWith('pt') ? 'pt' : 'en');
  }, [i18n.resolvedLanguage]);

  const hasSettingsChanges =
    JSON.stringify(initialSettings) !== JSON.stringify({ ...initialSettings, ...formData });
  const currentLanguage = i18n.resolvedLanguage?.startsWith('pt') ? 'pt' : 'en';
  const hasLanguageChanges = language !== currentLanguage;
  const isDirty = hasSettingsChanges || hasLanguageChanges;

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

      notificationService.success(t('settings.saveSuccess'));

    } catch (err) {
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
          <h2 className="text-lg font-semibold mb-2">{t('settings.language.title')}</h2>
          <p className="text-sm text-text-secondary mb-4">{t('settings.language.description')}</p>
          <Select
            label={t('settings.language.label')}
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
            disabled={isSaving}
          >
            <option value="pt">{t('sidebar.portuguese')}</option>
            <option value="en">{t('sidebar.english')}</option>
          </Select>
        </Card>
        <AccountSettings />
      </main>
    </div>
  );
};

export default SettingsPage;
