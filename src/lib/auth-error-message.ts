import axios, { type AxiosError } from "axios";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;
type AuthFlow = "login" | "register";

interface BackendFieldError {
  field?: string;
  defaultMessage?: string;
  message?: string;
}

interface BackendErrorPayload {
  message?: string;
  error?: string;
  details?: string;
  fieldErrors?: BackendFieldError[];
  errors?: Record<string, string> | BackendFieldError[];
}

const getFieldErrors = (payload?: BackendErrorPayload): BackendFieldError[] => {
  if (!payload) return [];
  const errors = payload.fieldErrors ?? payload.errors;
  
  if (Array.isArray(errors)) {
    return errors;
  }
  
  if (errors && typeof errors === 'object') {
    return Object.entries(errors).map(([field, message]) => ({
      field,
      message: typeof message === 'string' ? message : String(message)
    }));
  }
  
  return [];
};

const hasPasswordValidationError = (
  payload?: BackendErrorPayload
): boolean => {
  return getFieldErrors(payload).some((error) => {
    const fieldName = (error.field ?? "").toLowerCase();
    const errorMessage = (error.defaultMessage ?? error.message ?? "").toLowerCase();
    return fieldName === "password" || errorMessage.includes("password");
  });
};

export const getAuthErrorMessage = (
  error: unknown,
  t: TranslateFn,
  flow: AuthFlow
): string => {
  if (!axios.isAxiosError(error)) {
    return t(`auth.${flow}.error`);
  }

  const axiosError = error as AxiosError<BackendErrorPayload>;
  if (axiosError.code === "ECONNABORTED") {
    return t("auth.errors.timeout");
  }

  const response = axiosError.response;
  if (!response) {
    return t("auth.errors.network");
  }

  const payload = response.data;
  const backendMessage = payload?.message || payload?.details;
  const status = response.status;

  if (status === 401 || status === 403) {
    return t("auth.errors.invalidCredentials");
  }

  if (status === 409) {
    return t("auth.errors.duplicateUser");
  }

  if (status === 400 || status === 422) {
    if (hasPasswordValidationError(payload)) {
      return t("auth.errors.passwordRequirements");
    }

    if (flow === "register") {
      return t("auth.errors.invalidRegisterData");
    }

    return t("auth.errors.invalidLoginData");
  }

  if (status === 429) {
    return t("auth.errors.tooManyAttempts");
  }

  if (status >= 500) {
    return t("auth.errors.server");
  }

  if (backendMessage && backendMessage.trim().length > 0) {
    return backendMessage;
  }

  return t(`auth.${flow}.error`);
};

export const getFieldErrorMessage = (error: unknown, fieldName: string): string | null => {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const axiosError = error as AxiosError<BackendErrorPayload>;
  const response = axiosError.response;
  if (!response) {
    return null;
  }

  const payload = response.data;
  const fieldErrors = getFieldErrors(payload);
  
  const fieldError = fieldErrors.find((err) => {
    const errField = (err.field ?? "").toLowerCase();
    return errField === fieldName.toLowerCase();
  });
  
  if (fieldError) {
    return fieldError.message || fieldError.defaultMessage || null;
  }
  
  return null;
};
