import type { User } from "../api/types/domain";

const FIRST_LOGIN_ONBOARDING_PREFIX = "onboarding:first-login-seen";

const isUsableStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const resolveUserKey = (user: Pick<User, "id" | "email" | "username">) => {
  const rawKey = String(user.id ?? "").trim();
  if (rawKey && rawKey !== "unknown" && rawKey !== "new") {
    return rawKey;
  }

  const fallback = user.email?.trim() || user.username?.trim() || "anonymous";
  return fallback.toLowerCase();
};

export const getFirstLoginOnboardingKey = (user: Pick<User, "id" | "email" | "username">) => {
  return `${FIRST_LOGIN_ONBOARDING_PREFIX}:${resolveUserKey(user)}`;
};

export const hasSeenFirstLoginOnboarding = (user: Pick<User, "id" | "email" | "username">) => {
  if (!isUsableStorage()) {
    return false;
  }

  return window.localStorage.getItem(getFirstLoginOnboardingKey(user)) === "true";
};

export const markFirstLoginOnboardingSeen = (user: Pick<User, "id" | "email" | "username">) => {
  if (!isUsableStorage()) {
    return;
  }

  window.localStorage.setItem(getFirstLoginOnboardingKey(user), "true");
};
