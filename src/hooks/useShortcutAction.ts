import { useEffect, useRef } from 'react';
import { useKeyboardShortcuts } from '../contexts/utils/UseKeyboardShortcuts';
import type { ShortcutActionId } from '../lib/keyboardShortcuts';

interface UseShortcutActionOptions {
  enabled?: boolean;
  allowInEditable?: boolean;
  allowInInteractive?: boolean;
  allowInDialog?: boolean;
}

const useShortcutAction = (
  actionId: ShortcutActionId,
  handler: () => void,
  {
    enabled = true,
    allowInEditable = false,
    allowInInteractive = false,
    allowInDialog = false,
  }: UseShortcutActionOptions = {}
) => {
  const { registerShortcut } = useKeyboardShortcuts();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return registerShortcut({
      id: actionId,
      handler: () => handlerRef.current(),
      allowInEditable,
      allowInInteractive,
      allowInDialog,
    });
  }, [
    actionId,
    allowInDialog,
    allowInEditable,
    allowInInteractive,
    enabled,
    registerShortcut,
  ]);
};

export default useShortcutAction;
