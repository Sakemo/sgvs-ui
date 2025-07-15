import type React from "react";
import type { ProviderRequest, ProviderResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import Modal from "../../common/Modal";
import Input from "../../common/ui/Input";
import Button from "../../common/ui/Button";
import { createProvider } from "../../../api/services/provider.service";

interface ProviderAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProviderAdded: (newProvider: ProviderResponse) => void;
}

const ProviderAddModal: React.FC<ProviderAddModalProps> = ({
    isOpen, onClose, onProviderAdded
}) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError(t('validation.nameRequired', 'Provider name is required'));
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const payload: ProviderRequest = { name };
            const newProvider = await createProvider(payload);
            onProviderAdded(newProvider);
            onClose();
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message || t('errors.genericSave'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('provider.addTitle', 'Add New Provider')}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input 
                    label={t('common.name', 'Name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                    required
                    autoFocus
                />
                <div className="flex justify-end gap-2 pt-4 border-t border-border-light dark:border-border-dark">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                        {t('actions.cancel', 'Cancel')}
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {t('actions.save', 'Save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
export default ProviderAddModal;