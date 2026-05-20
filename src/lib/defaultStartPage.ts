export const DEFAULT_START_PAGE_STORAGE_KEY = "default-start-page";

export const START_PAGE_OPTIONS = [
  "/sales",
  "/dashboard",
  "/products",
  "/providers",
  "/customers",
  "/expenses",
  "/reports",
  "/settings",
] as const;

export type StartPage = (typeof START_PAGE_OPTIONS)[number];

export const DEFAULT_START_PAGE: StartPage = "/sales";

export const isStartPage = (value: unknown): value is StartPage =>
  typeof value === "string" &&
  START_PAGE_OPTIONS.includes(value as StartPage);

export const sanitizeStartPage = (value: unknown): StartPage =>
  isStartPage(value) ? value : DEFAULT_START_PAGE;
