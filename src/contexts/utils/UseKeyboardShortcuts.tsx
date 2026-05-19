import { useContext } from 'react';
import {
  KeyboardShortcutsRuntimeContext,
  type KeyboardShortcutsRuntimeContextType,
} from '../KeyboardShortcutsRuntimeContext';

export const useKeyboardShortcuts = (): KeyboardShortcutsRuntimeContextType => {
  const context = useContext(KeyboardShortcutsRuntimeContext);

  if (context === undefined) {
    throw new Error(
      'useKeyboardShortcuts must be used within a KeyboardShortcutsRuntimeProvider'
    );
  }

  return context;
};
