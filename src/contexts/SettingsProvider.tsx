import React, { useEffect, useState, type ReactNode } from "react";
import type { GeneralSettingsResponse } from "../api/types/domain";
import { getGeneralSettings } from "../api/services/settings.service";
import { useAuth } from "./AuthContext";
import { SettingsContext } from "./SettingsContext";

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const { isAuthenticated } = useAuth();
    const [settings, setSettings] = useState<GeneralSettingsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const value = { settings, isLoading, refetchSettings: fetchSettings };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
};

