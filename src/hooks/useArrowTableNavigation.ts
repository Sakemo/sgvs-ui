import { useCallback, useEffect } from "react";
import useShortcutAction from "./useShortcutAction";

interface UseArrowTableNavigationOptions<T> {
  items: T[];
  selectedId: number | string | null | undefined;
  getId: (item: T) => number | string;
  onSelect: (item: T) => void;
  enabled?: boolean;
  rowGroup?: string;
}

function useArrowTableNavigation<T>({
  items,
  selectedId,
  getId,
  onSelect,
  enabled = true,
  rowGroup,
}: UseArrowTableNavigationOptions<T>) {
  const canNavigate = enabled && selectedId != null && items.length > 0;

  const moveSelection = useCallback((direction: 1 | -1) => {
    if (selectedId == null) {
      return;
    }

    const currentIndex = items.findIndex((item) => getId(item) === selectedId);

    if (currentIndex === -1) {
      return;
    }

    const nextItem = items[currentIndex + direction];

    if (!nextItem) {
      return;
    }

    onSelect(nextItem);
  }, [getId, items, onSelect, selectedId]);

  useShortcutAction(
    "table.selectPrevious",
    () => moveSelection(-1),
    { enabled: canNavigate }
  );

  useShortcutAction(
    "table.selectNext",
    () => moveSelection(1),
    { enabled: canNavigate }
  );

  useEffect(() => {
    if (!enabled || selectedId == null || !rowGroup) {
      return;
    }

    const row = document.querySelector<HTMLElement>(
      `[data-row-group="${rowGroup}"][data-row-id="${String(selectedId)}"]`
    );

    row?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [enabled, rowGroup, selectedId]);
}

export default useArrowTableNavigation;
