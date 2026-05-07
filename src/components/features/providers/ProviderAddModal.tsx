import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";

import type { ProviderRequest, ProviderResponse } from "../../../api/types/domain";
import {
  createProvider,
  updateProvider,
} from "../../../api/services/provider.service";
import Modal from "../../common/Modal";
import Input from "../../common/ui/Input";
import Button from "../../common/ui/Button";
import Textarea from "../../common/ui/Textarea";
import AdvancedOptions from "../../common/AdvancedOptions";
import { notificationService } from "../../../lib/notification.service";
import {
  formatPhoneAutomatically,
  sanitizePhoneInput,
  validatePhone,
} from "../../../utils/formatters";

interface ProviderAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProviderAdded?: (provider: ProviderResponse) => void;
  onSaveSuccess?: (provider: ProviderResponse) => void;
  providerToEdit?: ProviderResponse | null;
}

const ProviderAddModal: React.FC<ProviderAddModalProps> = ({
  isOpen,
  onClose,
  onProviderAdded,
  onSaveSuccess,
  providerToEdit,
}) => {
  const { t } = useTranslation();
  const isEditMode = !!providerToEdit;

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(providerToEdit?.name ?? "");
    setCnpj(providerToEdit?.cnpj ?? "");
    setNotes(providerToEdit?.notes ?? "");
    setPhone(providerToEdit?.phone ?? "");
    setPhoneError(null);
    setEmail(providerToEdit?.email ?? "");
    setAddress(providerToEdit?.address ?? "");
  }, [isOpen, providerToEdit]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneInput(e.target.value);
    const formatted = formatPhoneAutomatically(sanitized);
    setPhone(formatted);

    if (sanitized.trim() !== "") {
      const validation = validatePhone(sanitized);
      setPhoneError(validation.error || null);
      return;
    }

    setPhoneError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      notificationService.error(t("validation.nameRequired"));
      return;
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || null);
      return;
    }

    setIsLoading(true);
    try {
      const payload: ProviderRequest = {
        name: name.trim(),
        cnpj: cnpj || null,
        notes: notes || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
      };

      const savedProvider =
        isEditMode && providerToEdit
          ? await updateProvider(providerToEdit.id, payload)
          : await createProvider(payload);

      const callback = onSaveSuccess ?? onProviderAdded;
      callback?.(savedProvider);
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      notificationService.error(
        axiosError.response?.data?.message || t("errors.genericSave")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t("provider.editTitle") : t("provider.addTitle")}
      className="sm:max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <Input
            label={t("common.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <AdvancedOptions className="space-y-4">
            <Input
              label={t("provider.cnpj")}
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder={t("provider.cnpjPlaceholder")}
            />
            <Input
              label={t("provider.phone")}
              value={phone}
              onChange={handlePhoneChange}
              placeholder={t("provider.phonePlaceholder")}
              error={phoneError}
              inputMode="tel"
            />
            <Input
              label={t("provider.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("provider.emailPlaceholder")}
            />
            <Textarea
              label={t("provider.address")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("provider.addressPlaceholder")}
              rows={2}
            />
            <Textarea
              label={t("provider.notes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("provider.notesPlaceholder")}
              rows={3}
            />
          </AdvancedOptions>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-border-light pt-4 dark:border-border-dark">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("actions.cancel")}
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditMode ? t("actions.saveChanges") : t("actions.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProviderAddModal;
