import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLowStockProducts } from "../../../api/services/product.service";
import type { LowStockProduct } from "../../../api/types/domain";
import { notificationService } from "../../../lib/notification.service";
import { addLowStockUpdatedListener } from "../../../lib/lowStockEvents";

const STORAGE_KEY = "low-stock-popup-collapsed";

const LowStockPopup: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMousePassthrough, setIsMousePassthrough] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });
  const previousProductCount = useRef<number>(0);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const fetchLowStock = useCallback(async () => {
    setIsLoading(true);
    try {
      const lowStockProducts = await getLowStockProducts();
      setProducts(lowStockProducts);
    } catch {
      notificationService.error(t("errors.fetchLowStockProducts"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchLowStock();
  }, [fetchLowStock]);

  useEffect(() => {
    const removeListener = addLowStockUpdatedListener(fetchLowStock);
    return removeListener;
  }, [fetchLowStock]);

  useEffect(() => {
    const intervalId = window.setInterval(fetchLowStock, 30000);
    return () => window.clearInterval(intervalId);
  }, [fetchLowStock]);

  useEffect(() => {
    if (!isLoading && products.length > 0 && previousProductCount.current === 0) {
      setIsCollapsed(false);
    }
    previousProductCount.current = products.length;
  }, [isLoading, products.length]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    if (!isMousePassthrough) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const popupElement = popupRef.current;
      if (!popupElement) {
        setIsMousePassthrough(false);
        return;
      }

      const rect = popupElement.getBoundingClientRect();
      const isPointerInsidePopup =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isPointerInsidePopup) {
        setIsMousePassthrough(false);
      }
    };

    const handleWindowBlur = () => {
      setIsMousePassthrough(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isMousePassthrough]);

  const summaryText = useMemo(() => {
    if (isLoading) return "Carregando...";
    return `${products.length} produto${products.length === 1 ? "" : "s"} com estoque baixo`;
  }, [isLoading, products.length]);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <div
      ref={popupRef}
      onMouseEnter={() => setIsMousePassthrough(true)}
      className={`fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-3xl border border-brand-primary/25 bg-white/95 shadow-[0_18px_42px_-22px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-all duration-300 dark:border-brand-primary/35 dark:bg-slate-950/95 ${
        isMousePassthrough ? "pointer-events-none opacity-10" : "opacity-100"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-accent dark:bg-brand-primary/15 dark:text-brand-primary">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("dashboard.lowStockAlerts")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{summaryText}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          aria-label={isCollapsed ? "Expandir alerta de estoque" : "Recolher alerta de estoque"}
        >
          {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="max-h-72 space-y-2 overflow-y-auto border-t border-slate-200/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800/80 dark:text-slate-300">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-slate-50 px-3 py-2 text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {product.currentStock}/{product.minimumStock}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t("dashboard.lowStockUnitsAndMinimum", {
                    currentStock: product.currentStock,
                    minimumStock: product.minimumStock,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LowStockPopup;
