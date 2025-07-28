import { useTranslation } from "react-i18next";
import type { CategoryRequest, CategoryResponse, EntitySummary } from "../../../api/types/domain";
import { useEffect, useState } from "react";
import { createCategory, updateCategory } from "../../../api/services/category.service";
import type { AxiosError } from "axios";
import Modal from "../../common/Modal";
import Input from "../../common/ui/Input";
import Button from "../../common/ui/Button";
import { notificationService } from "../../../lib/notification.service";

interface CategoryAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: (category: CategoryResponse) => void;
    categoryToEdit?: EntitySummary | null;
}

const CategoryFormModal: React.FC<CategoryAddModalProps> = ({
    isOpen, onClose, onSaveSuccess, categoryToEdit
}) => {
    const { t } = useTranslation();
    const isEditMode = !!categoryToEdit;
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            setName(isEditMode ? categoryToEdit.name : '');
        }
    }, [isOpen, isEditMode, categoryToEdit]);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim()) {
            notificationService.error(t('validation.nameRequired', 'Category name is required'));
            return;
        }
        setIsLoading(true);
        try {
            const payload: CategoryRequest = { name };
            let savedCategory : CategoryResponse;
            if (isEditMode) {
                savedCategory = await updateCategory(categoryToEdit.id, payload);
            } else {
                savedCategory = await createCategory(payload);
            }
            onSaveSuccess(savedCategory);
            notificationService.success(t('category.saveSuccess', 'Category added'))
            onClose();
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            notificationService.error(axiosError.response?.data?.message || t('errors.genericSave'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('category.addTitle', 'Add New Category')}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                    label={t('common.name', "Name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

export default CategoryFormModal;