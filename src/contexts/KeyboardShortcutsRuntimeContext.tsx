import { createContext } from 'react';
import type { ShortcutActionId } from '../lib/keyboardShortcuts';

export interface ShortcutRegistration {
  id: ShortcutActionId;
  handler: () => void;
  allowInEditable?: boolean;
  allowInInteractive?: boolean;
  allowInDialog?: boolean;
}

export interface KeyboardShortcutsRuntimeContextType {
  registerShortcut: (registration: ShortcutRegistration) => () => void;
  activeActionIds: ShortcutActionId[];
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
}

export const KeyboardShortcutsRuntimeContext =
  createContext<KeyboardShortcutsRuntimeContextType | undefined>(undefined);
