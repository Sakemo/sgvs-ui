// src/pages/SettingsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getGeneralSettings, updateGeneralSettings } from '../api/services/settings.service';
import type { GeneralSettingsRequest, GeneralSettingsResponse } from '../api/types/domain';
import StockControlSettings from '../components/features/settings/StockControlSettings';
import Button from '../components/common/ui/Button';
import { LuSave } from 'react-icons/lu';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [initialSettings, setInitialSettings] = useState<GeneralSettingsResponse | null>(null);
  const [formData, setFormData] = useState<Partial<GeneralSettingsRequest>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isDirty = JSON.stringify(initialSettings) !== JSON.stringify({ ...initialSettings, ...formData });

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const settings = await getGeneralSettings();
      setInitialSettings(settings);
      setFormData(settings); // Inicia o formulário com os dados da API
    } catch (err) {
      setError(t('errors.fetchSettings' + err, `Failed to load settings: ${err}`));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleFormChange = (updatedValues: Partial<GeneralSettingsRequest>) => {
    setFormData(prev => ({ ...prev, ...updatedValues }));
  };
  
  const handleSave = async () => {
    if (!isDirty) return;
    
    setIsSaving(true);
    setError(null);
    try {
      const payload = formData as GeneralSettingsRequest;
      const updatedSettings = await updateGeneralSettings(payload);
      
      setInitialSettings(updatedSettings);
      setFormData(updatedSettings);
      
    } catch (err) {
      setError(t('errors.saveSettings' + err, 
        `Failed to save settings: ${err}`));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p>{t('common.loading', 'Loading...')}</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('settings.pageTitle', 'Settings')}</h1>
        <Button onClick={handleSave} disabled={!isDirty || isSaving} isLoading={isSaving}>
          <LuSave className="mr-2 h-4 w-4" />
          {t('actions.saveChanges', 'Save Changes')}
        </Button>
      </header>

      <main>
        {initialSettings && (
          <StockControlSettings
            currentSelection={formData.stockControlType!}
            onChange={(value) => handleFormChange({ stockControlType: value })}
            disabled={isSaving}
          />
        )}
        
      </main>
    </div>
  );
};

export default SettingsPage;