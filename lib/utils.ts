/**
 * Utility functions for type safety and null handling
 */

/**
 * Safely gets a string value, providing a fallback for null/undefined
 */
export const safeString = (value: string | null | undefined, fallback: string = ''): string => {
  return value ?? fallback;
};

/**
 * Safely gets a user's email from session
 */
export const safeUserEmail = (session: any): string => {
  return session?.user?.email ?? '';
};

/**
 * Safely gets a user's ID from session
 */
export const safeUserId = (session: any): string | null => {
  return session?.user?.id ?? null;
};

/**
 * Checks if a session is valid and has required user data
 */
export const isValidSession = (session: any): boolean => {
  return !!(session?.user?.id && session?.user?.email);
};

/**
 * Safely gets an array from a potentially null/undefined value
 */
export const safeArray = <T>(value: T[] | null | undefined, fallback: T[] = []): T[] => {
  return value ?? fallback;
};

/**
 * Safely gets a profile field with fallback
 */
export const safeProfileField = (
  profile: any, 
  field: string, 
  fallback: string = ''
): string => {
  return profile?.[field] ?? fallback;
};

/**
 * Type guard to check if a value is not null or undefined
 */
export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Safely converts a value to string, handling null/undefined
 */
export const toSafeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};