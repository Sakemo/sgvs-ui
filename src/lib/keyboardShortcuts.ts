export const SHORTCUT_STORAGE_KEY = 'keyboard-shortcut-preferences';

export const SHORTCUT_ACTION_IDS = [
  'navigate.dashboard',
  'navigate.reports',
  'navigate.sales',
  'navigate.expenses',
  'navigate.products',
  'navigate.providers',
  'navigate.customers',
  'navigate.settings',
  'interface.toggleSidebar',
  'interface.showHelp',
  'page.focusPrimarySearch',
  'page.createNew',
  'settings.save',
  'table.selectPrevious',
  'table.selectNext',
] as const;

export type ShortcutActionId = (typeof SHORTCUT_ACTION_IDS)[number];

export type ShortcutCategory = 'navigation' | 'workspace' | 'table';
type ShortcutModifier = 'ctrl' | 'alt' | 'shift' | 'meta';

export interface ShortcutPreferences {
  enabled: boolean;
  bindings: Record<ShortcutActionId, string>;
}

export interface ShortcutActionDefinition {
  category: ShortcutCategory;
  labelKey: string;
  descriptionKey?: string;
}

export interface ShortcutConflict {
  actionId: ShortcutActionId;
  kind: 'duplicate' | 'prefix';
}

const ORDERED_MODIFIERS: ShortcutModifier[] = ['ctrl', 'alt', 'shift', 'meta'];

const MODIFIER_ALIASES: Record<string, ShortcutModifier> = {
  ctrl: 'ctrl',
  control: 'ctrl',
  alt: 'alt',
  option: 'alt',
  shift: 'shift',
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
};

const SPECIAL_KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  escape: 'escape',
  enter: 'enter',
  return: 'enter',
  tab: 'tab',
  space: 'space',
  spacebar: 'space',
  ' ': 'space',
  up: 'arrowup',
  arrowup: 'arrowup',
  down: 'arrowdown',
  arrowdown: 'arrowdown',
  left: 'arrowleft',
  arrowleft: 'arrowleft',
  right: 'arrowright',
  arrowright: 'arrowright',
  pageup: 'pageup',
  pagedown: 'pagedown',
  home: 'home',
  end: 'end',
  backspace: 'backspace',
  delete: 'delete',
};

export const KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT = 900;
export const KEYBOARD_SHORTCUT_MAX_STEPS = 2;

export const DEFAULT_SHORTCUT_BINDINGS: Record<ShortcutActionId, string> = {
  'navigate.dashboard': 'g d',
  'navigate.reports': 'g r',
  'navigate.sales': 'g v',
  'navigate.expenses': 'g e',
  'navigate.products': 'g p',
  'navigate.providers': 'g f',
  'navigate.customers': 'g c',
  'navigate.settings': 'g s',
  'interface.toggleSidebar': 'b',
  'interface.showHelp': 'shift+?',
  'page.focusPrimarySearch': '/',
  'page.createNew': 'n',
  'settings.save': 'ctrl+s',
  'table.selectPrevious': 'arrowup',
  'table.selectNext': 'arrowdown',
};

export const DEFAULT_SHORTCUT_PREFERENCES: ShortcutPreferences = {
  enabled: true,
  bindings: DEFAULT_SHORTCUT_BINDINGS,
};

export const SHORTCUT_CATEGORY_LABEL_KEYS: Record<ShortcutCategory, string> = {
  navigation: 'settings.keyboard.categories.navigation',
  workspace: 'settings.keyboard.categories.workspace',
  table: 'settings.keyboard.categories.table',
};

export const SHORTCUT_CATEGORY_ORDER: ShortcutCategory[] = [
  'navigation',
  'workspace',
  'table',
];

export const SHORTCUT_ACTION_DEFINITIONS: Record<
  ShortcutActionId,
  ShortcutActionDefinition
> = {
  'navigate.dashboard': {
    category: 'navigation',
    labelKey: 'sidebar.dashboard',
  },
  'navigate.reports': {
    category: 'navigation',
    labelKey: 'sidebar.reports',
  },
  'navigate.sales': {
    category: 'navigation',
    labelKey: 'sidebar.sales',
  },
  'navigate.expenses': {
    category: 'navigation',
    labelKey: 'sidebar.expenses',
  },
  'navigate.products': {
    category: 'navigation',
    labelKey: 'sidebar.products',
  },
  'navigate.providers': {
    category: 'navigation',
    labelKey: 'sidebar.providers',
  },
  'navigate.customers': {
    category: 'navigation',
    labelKey: 'sidebar.customers',
  },
  'navigate.settings': {
    category: 'navigation',
    labelKey: 'sidebar.settings',
  },
  'interface.toggleSidebar': {
    category: 'workspace',
    labelKey: 'settings.keyboard.actions.toggleSidebar.label',
    descriptionKey: 'settings.keyboard.actions.toggleSidebar.description',
  },
  'interface.showHelp': {
    category: 'workspace',
    labelKey: 'settings.keyboard.actions.showHelp.label',
    descriptionKey: 'settings.keyboard.actions.showHelp.description',
  },
  'page.focusPrimarySearch': {
    category: 'workspace',
    labelKey: 'settings.keyboard.actions.focusPrimarySearch.label',
    descriptionKey: 'settings.keyboard.actions.focusPrimarySearch.description',
  },
  'page.createNew': {
    category: 'workspace',
    labelKey: 'settings.keyboard.actions.createNew.label',
    descriptionKey: 'settings.keyboard.actions.createNew.description',
  },
  'settings.save': {
    category: 'workspace',
    labelKey: 'settings.keyboard.actions.saveSettings.label',
    descriptionKey: 'settings.keyboard.actions.saveSettings.description',
  },
  'table.selectPrevious': {
    category: 'table',
    labelKey: 'settings.keyboard.actions.selectPrevious.label',
    descriptionKey: 'settings.keyboard.actions.selectPrevious.description',
  },
  'table.selectNext': {
    category: 'table',
    labelKey: 'settings.keyboard.actions.selectNext.label',
    descriptionKey: 'settings.keyboard.actions.selectNext.description',
  },
};

export const SHORTCUT_ACTIONS_BY_CATEGORY = SHORTCUT_CATEGORY_ORDER.reduce(
  (accumulator, category) => {
    accumulator[category] = SHORTCUT_ACTION_IDS.filter(
      (actionId) => SHORTCUT_ACTION_DEFINITIONS[actionId].category === category
    );
    return accumulator;
  },
  {} as Record<ShortcutCategory, ShortcutActionId[]>
);

export const NAVIGATION_SHORTCUTS: Array<{
  actionId: ShortcutActionId;
  path: string;
}> = [
  { actionId: 'navigate.dashboard', path: '/dashboard' },
  { actionId: 'navigate.reports', path: '/reports' },
  { actionId: 'navigate.sales', path: '/sales' },
  { actionId: 'navigate.expenses', path: '/expenses' },
  { actionId: 'navigate.products', path: '/products' },
  { actionId: 'navigate.providers', path: '/providers' },
  { actionId: 'navigate.customers', path: '/customers' },
  { actionId: 'navigate.settings', path: '/settings' },
];

const HUMAN_MODIFIER_LABELS: Record<ShortcutModifier, string> = {
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
};

const HUMAN_KEY_LABELS: Record<string, string> = {
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  escape: 'Esc',
  enter: 'Enter',
  tab: 'Tab',
  home: 'Home',
  end: 'End',
  backspace: 'Backspace',
  delete: 'Delete',
  space: 'Space',
};

const isModifierToken = (token: string): token is ShortcutModifier =>
  ORDERED_MODIFIERS.includes(token as ShortcutModifier);

const normalizeToken = (token: string): string | null => {
  const normalizedToken = token.trim().toLowerCase();

  if (!normalizedToken) {
    return null;
  }

  if (MODIFIER_ALIASES[normalizedToken]) {
    return MODIFIER_ALIASES[normalizedToken];
  }

  if (SPECIAL_KEY_ALIASES[normalizedToken]) {
    return SPECIAL_KEY_ALIASES[normalizedToken];
  }

  if (
    normalizedToken === 'dead' ||
    normalizedToken === 'process' ||
    normalizedToken === 'unidentified'
  ) {
    return null;
  }

  return normalizedToken.length === 1 ? normalizedToken : normalizedToken;
};

export const normalizeShortcutKey = (rawKey: string): string | null =>
  normalizeToken(rawKey);

export const serializeShortcutSteps = (steps: string[]): string =>
  steps.join(' ');

export const parseShortcutBinding = (binding: string): string[] => {
  const trimmedBinding = binding.trim().toLowerCase();

  if (!trimmedBinding) {
    return [];
  }

  const rawSteps = trimmedBinding.split(/\s+/).slice(0, KEYBOARD_SHORTCUT_MAX_STEPS);
  const normalizedSteps: string[] = [];

  for (const rawStep of rawSteps) {
    const rawParts = rawStep.split('+').filter(Boolean);
    const modifiers = new Set<ShortcutModifier>();
    let keyToken: string | null = null;

    for (const rawPart of rawParts) {
      const normalizedPart = normalizeToken(rawPart);

      if (!normalizedPart) {
        return [];
      }

      if (isModifierToken(normalizedPart)) {
        modifiers.add(normalizedPart);
        continue;
      }

      if (keyToken) {
        return [];
      }

      keyToken = normalizedPart;
    }

    if (!keyToken || isModifierToken(keyToken)) {
      return [];
    }

    const orderedParts = ORDERED_MODIFIERS.filter((modifier) =>
      modifiers.has(modifier)
    );
    normalizedSteps.push([...orderedParts, keyToken].join('+'));
  }

  return normalizedSteps;
};

export const normalizeShortcutBinding = (binding: string): string =>
  serializeShortcutSteps(parseShortcutBinding(binding));

export const getShortcutStepFromEvent = (
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>
): string | null => {
  const normalizedKey = normalizeShortcutKey(event.key);

  if (!normalizedKey || isModifierToken(normalizedKey)) {
    return null;
  }

  const modifiers: ShortcutModifier[] = [];

  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (event.shiftKey) modifiers.push('shift');
  if (event.metaKey) modifiers.push('meta');

  return [...modifiers, normalizedKey].join('+');
};

const formatShortcutStep = (step: string) => {
  const parts = step.split('+');
  const keyPart = parts.at(-1);

  if (!keyPart) {
    return '';
  }

  const modifierLabel = parts
    .slice(0, -1)
    .map((part) => HUMAN_MODIFIER_LABELS[part as ShortcutModifier] ?? part);
  const keyLabel =
    HUMAN_KEY_LABELS[keyPart] ??
    (keyPart.length === 1 ? keyPart.toUpperCase() : keyPart);

  return [...modifierLabel, keyLabel].join(' + ');
};

export const formatShortcutBinding = (binding: string): string => {
  const steps = parseShortcutBinding(binding);

  if (steps.length === 0) {
    return '';
  }

  return steps.map(formatShortcutStep).join(' > ');
};

export const sanitizeShortcutPreferences = (
  value: unknown
): ShortcutPreferences => {
  if (!value || typeof value !== 'object') {
    return DEFAULT_SHORTCUT_PREFERENCES;
  }

  const candidate = value as Partial<ShortcutPreferences>;
  const candidateBindings =
    candidate.bindings && typeof candidate.bindings === 'object'
      ? (candidate.bindings as Partial<Record<ShortcutActionId, string>>)
      : ({} as Partial<Record<ShortcutActionId, string>>);

  const bindings = SHORTCUT_ACTION_IDS.reduce((accumulator, actionId) => {
    const rawBinding = candidateBindings[actionId];
    const normalizedBinding =
      typeof rawBinding === 'string'
        ? normalizeShortcutBinding(rawBinding)
        : DEFAULT_SHORTCUT_BINDINGS[actionId];

    accumulator[actionId] = normalizedBinding;
    return accumulator;
  }, {} as Record<ShortcutActionId, string>);

  return {
    enabled:
      typeof candidate.enabled === 'boolean'
        ? candidate.enabled
        : DEFAULT_SHORTCUT_PREFERENCES.enabled,
    bindings,
  };
};

const isSameSequence = (left: string[], right: string[]) =>
  left.length === right.length &&
  left.every((step, index) => step === right[index]);

const isSequencePrefix = (candidate: string[], full: string[]) =>
  candidate.length < full.length &&
  candidate.every((step, index) => step === full[index]);

export const getShortcutBindingConflicts = (
  bindings: Record<ShortcutActionId, string>
): Partial<Record<ShortcutActionId, ShortcutConflict[]>> => {
  const conflicts: Partial<Record<ShortcutActionId, ShortcutConflict[]>> = {};

  SHORTCUT_ACTION_IDS.forEach((actionId, index) => {
    const currentSteps = parseShortcutBinding(bindings[actionId]);

    if (currentSteps.length === 0) {
      return;
    }

    SHORTCUT_ACTION_IDS.slice(index + 1).forEach((otherActionId) => {
      const otherSteps = parseShortcutBinding(bindings[otherActionId]);

      if (otherSteps.length === 0) {
        return;
      }

      const hasDuplicateConflict = isSameSequence(currentSteps, otherSteps);
      const hasPrefixConflict =
        isSequencePrefix(currentSteps, otherSteps) ||
        isSequencePrefix(otherSteps, currentSteps);

      if (!hasDuplicateConflict && !hasPrefixConflict) {
        return;
      }

      const kind: ShortcutConflict['kind'] = hasDuplicateConflict
        ? 'duplicate'
        : 'prefix';

      conflicts[actionId] = [
        ...(conflicts[actionId] ?? []),
        { actionId: otherActionId, kind },
      ];
      conflicts[otherActionId] = [
        ...(conflicts[otherActionId] ?? []),
        { actionId, kind },
      ];
    });
  });

  return conflicts;
};
