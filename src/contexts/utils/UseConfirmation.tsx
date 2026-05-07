import { createContext, useContext } from "react";

export interface ConfirmationOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
}

export const ConfirmationModalContext = createContext((_options: ConfirmationOptions) => {});


export const useConfirmation = () => {
    return useContext(ConfirmationModalContext);
};
