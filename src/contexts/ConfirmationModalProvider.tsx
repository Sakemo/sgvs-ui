import React, { useCallback, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../components/common/Modal";
import { LuTriangleAlert } from "react-icons/lu";
import Button from "../components/common/ui/Button";
import {
  ConfirmationModalContext,
  type ConfirmationOptions,
} from "./utils/UseConfirmation";

export const ConfirmationModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showConfirmation = useCallback((newOptions: ConfirmationOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (options) {
      options.onConfirm();
    }
    handleClose();
  };

  return (
    <ConfirmationModalContext.Provider value={showConfirmation}>
      {children}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={options ? options.title : ""}
      >
        {options && (
            
          <div className="p-2 text-center">
            <div className="grid grid-cols-4 [&>*:nth-child(2)]:col-span-3 gap-4 justify-between">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/50">
              <LuTriangleAlert
                className="h-6 w-6 text-red-600 dark:text-red-300"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-sm text-text-secondary dark:text-gray-300">
              {options.description}
            </p>
          </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="secondary" onClick={handleClose}>
                {t("actions.cancel", "Cancel")}
              </Button>
              <Button variant="primary" onClick={handleConfirm}>
                {options.confirmText || t("actions.confirm", "Confirm")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmationModalContext.Provider>
  );
};
