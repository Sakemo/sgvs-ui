import { useEffect } from "react";

interface UseArrowTableNavigationOptions<T> {
  items: T[];
  selectedId: number | string | null | undefined;
  getId: (item: T) => number | string;
  onSelect: (item: T) => void;
  enabled?: boolean;
  rowGroup?: string;
}

const INTERACTIVE_SELECTOR = [
  "input",
  "textarea",
  "select",
  "button",
  "a[href]",
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
  '[role="textbox"]',
  '[role="combobox"]',
].join(",");

const shouldIgnoreTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest('[role="dialog"]')) {
    return true;
  }

  return target.closest(INTERACTIVE_SELECTOR) !== null;
};

function useArrowTableNavigation<T>({
  items,
  selectedId,
  getId,
  onSelect,
  enabled = true,
  rowGroup,
}: UseArrowTableNavigationOptions<T>) {
  useEffect(() => {
    if (!enabled || selectedId == null || items.length === 0) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      if (shouldIgnoreTarget(event.target)) {
        return;
      }

      const currentIndex = items.findIndex((item) => getId(item) === selectedId);

      if (currentIndex === -1) {
        return;
      }

      const nextIndex =
        event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
      const nextItem = items[nextIndex];

      if (!nextItem) {
        return;
      }

      event.preventDefault();
      onSelect(nextItem);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, getId, items, onSelect, selectedId]);

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
