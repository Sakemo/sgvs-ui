const LOW_STOCK_UPDATED_EVENT = "low-stock-updated";

export const dispatchLowStockUpdatedEvent = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOW_STOCK_UPDATED_EVENT));
};

export const addLowStockUpdatedListener = (
  listener: () => void,
): (() => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(LOW_STOCK_UPDATED_EVENT, listener);
  return () => {
    window.removeEventListener(LOW_STOCK_UPDATED_EVENT, listener);
  };
};
