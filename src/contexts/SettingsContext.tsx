import { createContext } from "react";
import type { GeneralSettingsResponse } from "../api/types/domain";

export interface SettingsContextType {
    settings: GeneralSettingsResponse | null;
    isLoading: boolean;
    refetchSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
