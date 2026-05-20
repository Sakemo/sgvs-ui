import React, { useEffect, useState, type ReactNode } from "react";
import type { GeneralSettingsResponse } from "../api/types/domain";
import { getGeneralSettings } from "../api/services/settings.service";
import { useAuth } from "./AuthContext";
import { SettingsContext } from "./SettingsContext";
import {
    sanitizeShortcutPreferences,
    SHORTCUT_STORAGE_KEY,
    type ShortcutPreferences,
} from "../lib/keyboardShortcuts";
import {
    DEFAULT_START_PAGE_STORAGE_KEY,
    sanitizeStartPage,
    type StartPage,
} from "../lib/defaultStartPage";

const loadShortcutPreferences = (): ShortcutPreferences => {
    try {
        const rawValue = localStorage.getItem(SHORTCUT_STORAGE_KEY);
        return sanitizeShortcutPreferences(rawValue ? JSON.parse(rawValue) : null);
    } catch {
        return sanitizeShortcutPreferences(null);
    }
};

const loadDefaultStartPage = (): StartPage => {
    try {
        return sanitizeStartPage(localStorage.getItem(DEFAULT_START_PAGE_STORAGE_KEY));
    } catch {
        return sanitizeStartPage(null);
    }
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const { isAuthenticated } = useAuth();
    const [settings, setSettings] = useState<GeneralSettingsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shortcutPreferences, setShortcutPreferences] = useState<ShortcutPreferences>(loadShortcutPreferences);
    const [defaultStartPage, setDefaultStartPage] = useState<StartPage>(loadDefaultStartPage);

    const fetchSettings = () => {
        if (!isAuthenticated) {
            setSettings(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        getGeneralSettings()
            .then(setSettings)
            .catch((error) => {
                console.error(error);
                setSettings(null);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setSettings(null);
            setIsLoading(false);
            return;
        }

        let isActive = true;

        setIsLoading(true);
        getGeneralSettings()
            .then((response) => {
                if (isActive) {
                    setSettings(response);
                }
            })
            .catch((error) => {
                console.error(error);
                if (isActive) {
                    setSettings(null);
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [isAuthenticated]);

    const updateShortcutPreferences = (preferences: ShortcutPreferences) => {
        const sanitizedPreferences = sanitizeShortcutPreferences(preferences);
        setShortcutPreferences(sanitizedPreferences);
        localStorage.setItem(SHORTCUT_STORAGE_KEY, JSON.stringify(sanitizedPreferences));
    };

    const updateDefaultStartPage = (page: StartPage) => {
        const sanitizedPage = sanitizeStartPage(page);
        setDefaultStartPage(sanitizedPage);
        localStorage.setItem(DEFAULT_START_PAGE_STORAGE_KEY, sanitizedPage);
    };

    const value = {
        settings,
        isLoading,
        refetchSettings: fetchSettings,
        shortcutPreferences,
        updateShortcutPreferences,
        defaultStartPage,
        updateDefaultStartPage,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
};

