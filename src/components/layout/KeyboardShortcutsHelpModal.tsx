import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import { useKeyboardShortcuts } from '../../contexts/utils/UseKeyboardShortcuts';
import { useSettings } from '../../contexts/utils/UseSettings';
import {
  formatShortcutBinding,
  SHORTCUT_ACTION_DEFINITIONS,
  SHORTCUT_ACTIONS_BY_CATEGORY,
  SHORTCUT_CATEGORY_LABEL_KEYS,
  SHORTCUT_CATEGORY_ORDER,
} from '../../lib/keyboardShortcuts';

const KeyboardShortcutsHelpModal: React.FC = () => {
  const { t } = useTranslation();
  const { isHelpOpen, closeHelp, activeActionIds } = useKeyboardShortcuts();
  const { shortcutPreferences } = useSettings();

  const groupedActions = useMemo(
    () =>
      SHORTCUT_CATEGORY_ORDER.map((category) => ({
        category,
        actions: SHORTCUT_ACTIONS_BY_CATEGORY[category].filter((actionId) =>
          activeActionIds.includes(actionId)
        ),
      })).filter(({ actions }) => actions.length > 0),
    [activeActionIds]
  );

  return (
    <Modal
      isOpen={isHelpOpen}
      onClose={closeHelp}
      title={t('settings.keyboard.help.title')}
      className="sm:max-w-3xl"
    >
      <div className="space-y-6">
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
          {t('settings.keyboard.help.description')}
        </p>

        {groupedActions.length === 0 ? (
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
            {t('settings.keyboard.help.empty')}
          </p>
        ) : (
          <div className="space-y-5">
            {groupedActions.map(({ category, actions }) => (
              <section key={category} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-dark-secondary">
                  {t(SHORTCUT_CATEGORY_LABEL_KEYS[category])}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {actions.map((actionId) => {
                    const definition = SHORTCUT_ACTION_DEFINITIONS[actionId];
                    const shortcutLabel = formatShortcutBinding(
                      shortcutPreferences.bindings[actionId]
                    );

                    return (
                      <div
                        key={actionId}
                        className="rounded-card border border-border-light bg-bg-light/60 p-4 dark:border-border-dark-subtle dark:bg-bg-dark-tertiary/60"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-text-primary dark:text-text-dark-primary">
                              {t(definition.labelKey)}
                            </p>
                            {definition.descriptionKey && (
                              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">
                                {t(definition.descriptionKey)}
                              </p>
                            )}
                          </div>
                          <kbd className="rounded border border-border-light bg-card-light px-2 py-1 text-xs font-semibold text-text-primary dark:border-border-dark-subtle dark:bg-card-dark dark:text-text-dark-primary">
                            {shortcutLabel}
                          </kbd>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsHelpModal;
