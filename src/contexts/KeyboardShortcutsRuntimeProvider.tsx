import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardShortcutsRuntimeContext,
  type ShortcutRegistration,
} from './KeyboardShortcutsRuntimeContext';
import {
  KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT,
  getShortcutStepFromEvent,
  parseShortcutBinding,
  type ShortcutActionId,
} from '../lib/keyboardShortcuts';
import { useSettings } from './utils/UseSettings';

const EDITABLE_SELECTOR = [
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[role="textbox"]',
  '[role="combobox"]',
].join(',');

const INTERACTIVE_SELECTOR = [
  EDITABLE_SELECTOR,
  'button',
  'a[href]',
  '[role="button"]',
  '[role="link"]',
].join(',');

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest(EDITABLE_SELECTOR) !== null;

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;

const isDialogTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest('[role="dialog"]') !== null;

const matchesSequence = (candidate: string[], expected: string[]) =>
  candidate.length === expected.length &&
  candidate.every((step, index) => step === expected[index]);

const matchesPrefix = (candidate: string[], expected: string[]) =>
  candidate.length < expected.length &&
  candidate.every((step, index) => step === expected[index]);

type RegisteredShortcut = ShortcutRegistration & { token: symbol };

interface KeyboardShortcutsRuntimeProviderProps {
  children: React.ReactNode;
}

export const KeyboardShortcutsRuntimeProvider: React.FC<
  KeyboardShortcutsRuntimeProviderProps
> = ({ children }) => {
  const { shortcutPreferences } = useSettings();
  const [registrations, setRegistrations] = useState<
    Partial<Record<ShortcutActionId, RegisteredShortcut[]>>
  >({});
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const pendingSequenceRef = useRef<{
    steps: string[];
    expiresAt: number;
  }>({
    steps: [],
    expiresAt: 0,
  });

  const registerShortcut = useCallback((registration: ShortcutRegistration) => {
    const token = Symbol(registration.id);

    setRegistrations((current) => ({
      ...current,
      [registration.id]: [
        ...(current[registration.id] ?? []),
        { ...registration, token },
      ],
    }));

    return () => {
      setRegistrations((current) => {
        const nextEntries = (current[registration.id] ?? []).filter(
          (entry) => entry.token !== token
        );

        if (nextEntries.length === 0) {
          const nextRegistrations = { ...current };
          delete nextRegistrations[registration.id];
          return nextRegistrations;
        }

        return {
          ...current,
          [registration.id]: nextEntries,
        };
      });
    };
  }, []);

  const activeRegistrations = useMemo(
    () =>
      Object.entries(registrations)
        .map(([actionId, entries]) => ({
          actionId: actionId as ShortcutActionId,
          registration: entries?.at(-1) ?? null,
        }))
        .filter(
          (
            entry
          ): entry is {
            actionId: ShortcutActionId;
            registration: RegisteredShortcut;
          } => entry.registration !== null
        ),
    [registrations]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || !shortcutPreferences.enabled) {
        return;
      }

      const step = getShortcutStepFromEvent(event);

      if (!step) {
        return;
      }

      const now = Date.now();
      const pendingSequence =
        pendingSequenceRef.current.expiresAt > now
          ? pendingSequenceRef.current.steps
          : [];

      const eligibleRegistrations = activeRegistrations
        .map(({ actionId, registration }) => ({
          actionId,
          registration,
          steps: parseShortcutBinding(shortcutPreferences.bindings[actionId]),
        }))
        .filter(({ steps }) => steps.length > 0)
        .filter(({ registration }) => {
          if (isDialogTarget(event.target) && !registration.allowInDialog) {
            return false;
          }

          if (isEditableTarget(event.target) && !registration.allowInEditable) {
            return false;
          }

          if (
            !isEditableTarget(event.target) &&
            isInteractiveTarget(event.target) &&
            !registration.allowInInteractive
          ) {
            return false;
          }

          return true;
        });

      const candidateSequence = [...pendingSequence, step];

      const fullMatch = eligibleRegistrations.find(({ steps }) =>
        matchesSequence(candidateSequence, steps)
      );

      if (fullMatch) {
        event.preventDefault();
        pendingSequenceRef.current = { steps: [], expiresAt: 0 };
        fullMatch.registration.handler();
        return;
      }

      const prefixMatch = eligibleRegistrations.some(({ steps }) =>
        matchesPrefix(candidateSequence, steps)
      );

      if (prefixMatch) {
        event.preventDefault();
        pendingSequenceRef.current = {
          steps: candidateSequence,
          expiresAt: now + KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT,
        };
        return;
      }

      pendingSequenceRef.current = { steps: [], expiresAt: 0 };
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeRegistrations, shortcutPreferences]);

  const activeActionIds = useMemo(
    () =>
      activeRegistrations
        .map(({ actionId }) => actionId)
        .filter((actionId) => parseShortcutBinding(shortcutPreferences.bindings[actionId]).length > 0),
    [activeRegistrations, shortcutPreferences.bindings]
  );

  const openHelp = useCallback(() => setIsHelpOpen(true), []);
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);
  const toggleHelp = useCallback(() => setIsHelpOpen((current) => !current), []);

  const value = useMemo(
    () => ({
      registerShortcut,
      activeActionIds,
      isHelpOpen,
      openHelp,
      closeHelp,
      toggleHelp,
    }),
    [registerShortcut, activeActionIds, isHelpOpen, openHelp, closeHelp, toggleHelp]
  );

  return (
    <KeyboardShortcutsRuntimeContext.Provider value={value}>
      {children}
    </KeyboardShortcutsRuntimeContext.Provider>
  );
};
