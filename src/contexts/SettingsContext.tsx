import { createContext } from "react";
import type { GeneralSettingsResponse } from "../api/types/domain";
import type { ShortcutPreferences } from "../lib/keyboardShortcuts";
import type { StartPage } from "../lib/defaultStartPage";

export interface SettingsContextType {
    settings: GeneralSettingsResponse | null;
    isLoading: boolean;
    refetchSettings: () => void;
    shortcutPreferences: ShortcutPreferences;
    updateShortcutPreferences: (preferences: ShortcutPreferences) => void;
    defaultStartPage: StartPage;
    updateDefaultStartPage: (page: StartPage) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
