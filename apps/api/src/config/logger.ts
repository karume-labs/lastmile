/**
 * config/logger.ts
 *
 * Fallback logger implementation to resolve the audit module compilation.
 */

export const logger = {
  error: (message: string, ...args: any[]) => console.error(message, ...args),
  info: (message: string, ...args: any[]) => console.log(message, ...args),
  warn: (message: string, ...args: any[]) => console.warn(message, ...args),
};
