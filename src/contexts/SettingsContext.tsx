import { createContext } from "react";
import type { GeneralSettingsResponse } from "../api/types/domain";
import type { ShortcutPreferences } from "../lib/keyboardShortcuts";

export interface SettingsContextType {
    settings: GeneralSettingsResponse | null;
    isLoading: boolean;
    refetchSettings: () => void;
    shortcutPreferences: ShortcutPreferences;
    updateShortcutPreferences: (preferences: ShortcutPreferences) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
