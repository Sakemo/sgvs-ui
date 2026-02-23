import type React from "react";
import { useTheme } from "../../../contexts/utils/UseTheme";
import { useTranslation } from "react-i18next";
import Button from "../../common/ui/Button";
import { LuMoon, LuSun } from "react-icons/lu";

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <Button variant="ghost" onClick={toggleTheme} className="dark:text-gray-300 text-text-secondary" iconLeft=           {theme === 'light' ? (<LuMoon />) : (<LuSun />)}
        title={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}>

            {theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
        </Button>
    );
};
export default ThemeToggleButton;
