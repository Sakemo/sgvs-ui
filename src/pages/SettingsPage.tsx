// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { updateGeneralSettings } from '../api/services/settings.service';
import type { GeneralSettingsRequest } from '../api/types/domain';
import StockControlSettings from '../components/features/settings/StockControlSettings';
import Button from '../components/common/ui/Button';
import { LuSave } from 'react-icons/lu';
import { useSettings } from '../contexts/utils/UseSettings';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const { settings: initialSettings, isLoading, refetchSettings } = useSettings();
  const [formData, setFormData] = useState<Partial<GeneralSettingsRequest>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if(initialSettings) {
      setFormData(initialSettings);
    }
  }, [initialSettings]);

  const isDirty = JSON.stringify(initialSettings) !== JSON.stringify({ ...initialSettings, ...formData });

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
      
      refetchSettings();
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
        <h1 className="text-2xl font-semibold dark:text-gray-200">{t('settings.pageTitle', 'Settings')}</h1>
        <Button onClick={handleSave} disabled={!isDirty || isSaving} isLoading={isSaving} iconLeft={<LuSave />}>
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