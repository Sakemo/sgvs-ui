import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { updateProfile, deleteProfile } from '../../../api/services/auth.service';
import { notificationService } from '../../../lib/notification.service';
import { useConfirmation } from '../../../contexts/utils/UseConfirmation';
import Button from '../../common/ui/Button';
import Input from '../../common/ui/Input';
import Card from '../../common/ui/Card';
import {
  LuUser, LuMail, LuLock, LuLogOut, LuTrash2, LuUserPlus,
  LuPencil, LuCopy, LuEye, LuEyeOff, LuCheck, LuX
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const AccountSettings: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const confirm = useConfirmation();
  const navigate = useNavigate();

  const [editingField, setEditingField] = useState<'username' | 'email' | 'password' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    notificationService.success(t('common.copied', 'Copied!'));
  };

  const cancelEdit = () => {
    setEditingField(null);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
    });
    setShowPassword(false);
  };

  const handleSaveField = async (field: 'username' | 'email' | 'password') => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...formData,
        password: field === 'password' ? formData.password : undefined
      });
      notificationService.success(t('settings.account.updateSuccess'));
      setEditingField(null);
    } catch (err) {
      notificationService.error(t('errors.updateProfile'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    confirm({
      title: t('settings.account.deleteTitle'),
      description: t('settings.account.deleteDesc'),
      confirmText: t('actions.delete'),
      onConfirm: async () => {
        try {
          await deleteProfile();
          logout();
          navigate('/login');
        } catch (err) {
          notificationService.error(t('errors.deleteAccount'));
        }
      },
    });
  };

  const InfoRow = ({
    label,
    value,
    field,
    isSecret = false
  }: {
    label: string,
    value: string,
    field: 'username' | 'email' | 'password',
    isSecret?: boolean
  }) => {
    const isEditing = editingField === field;

    return (
      <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark last:border-0">
        <div className="flex-1">
          <dt className="text-sm font-medium text-text-secondary mb-1">{label}</dt>
          <dd className="text-text-primary dark:text-gray-100 flex items-center gap-2">
            {isEditing ? (
              <div className="flex gap-2 w-full max-w-md">
                <Input
                  autoFocus
                  type={field === 'password' && !showPassword ? 'password' : 'text'}
                  value={formData[field]}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                  className="h-9"
                />
              </div>
            ) : (
              // Plain text sem background
              <span className="text-sm font-medium">
                {isSecret ? (showPassword ? '********' : '••••••••') : value}
              </span>
            )}

            {/* Ícone de Olho para a senha - Sempre visível se for o campo de senha */}
            {isSecret && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-secondary hover:text-brand-primary transition-colors p-1"
                title={showPassword ? t('actions.hide') : t('actions.show')}
              >
                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            )}
          </dd>
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleSaveField(field)} isLoading={isLoading}>
                <LuCheck size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-600" onClick={cancelEdit}>
                <LuX size={18} />
              </Button>
            </>
          ) : (
            <>
              {!isSecret && (
                <Button variant="ghost" size="icon" title={t('actions.copy')} onClick={() => handleCopy(value)}>
                  <LuCopy size={16} className="text-text-secondary" />
                </Button>
              )}
              <Button variant="ghost" size="icon" title={t('actions.edit')} onClick={() => setEditingField(field)}>
                <LuPencil size={16} className="text-brand-primary" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LuUser className="text-brand-primary" /> {t('settings.account.title', 'Account Profile')}
        </h2>

        <dl className="mt-2 divide-y divide-border-light dark:divide-border-dark">
          <InfoRow label={t('common.username', 'Username')} value={user?.username || ''} field="username" />
          <InfoRow label={t('common.email', 'Email Address')} value={user?.email || ''} field="email" />
          <InfoRow label={t('common.password', 'Password')} value="" field="password" isSecret />
        </dl>
      </Card>

      <Card className="border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10">
        <h2 className="text-lg font-semibold text-red-600 mb-4">{t('settings.account.dangerZone', 'Danger Zone')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={logout} iconLeft={<LuLogOut />}>
            {t('actions.logout', 'Sign Out')}
          </Button>

          <Button variant="secondary" onClick={() => navigate('/register')} iconLeft={<LuUserPlus />}>
            {t('actions.registerNew', 'Register New Account')}
          </Button>

          <Button variant="danger" onClick={handleDeleteAccount} iconLeft={<LuTrash2 />}>
            {t('actions.deleteAccount', 'Delete My Account')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccountSettings;
