import React, { useEffect, useState, type ReactNode } from "react";
import type { GeneralSettingsResponse } from "../api/types/domain";
import { getGeneralSettings } from "../api/services/settings.service";
import { SettingsContext } from "./SettingsContext";

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [settings, setSettings] = useState<GeneralSettingsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = () => {
        setIsLoading(true);
        getGeneralSettings()
            .then(setSettings)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const value = { settings, isLoading, refetchSettings: fetchSettings };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
};

