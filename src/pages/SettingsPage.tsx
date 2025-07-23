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

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const { settings: initialSettings, isLoading, refetchSettings } = useSettings();
  const [formData, setFormData] = useState<Partial<GeneralSettingsRequest>>({});
  const [isSaving, setIsSaving] = useState(false);  

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
    try {
      const payload = formData as GeneralSettingsRequest;
      const updatedSettings = await updateGeneralSettings(payload);
      
      refetchSettings();
      setFormData(updatedSettings);
      notificationService.success(t('settings.saveSuccess', 'Settings saved'))
      
    } catch (err) {
      notificationService.error(t('errors.saveSettings' + err, 
        `Failed to save settings: ${err}`));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p>{t('common.loading', 'Loading...')}</p>;
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