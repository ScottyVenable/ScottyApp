import {useDevStore} from '../store/devStore';

type LogLevel = 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, context?: string) {
  useDevStore.getState().addLog({level, message, context});
  if (__DEV__) {
    const tag = `[ScottyApp${context ? `:${context}` : ''}]`;
    if (level === 'error') console.error(tag, message);
    else if (level === 'warn') console.warn(tag, message);
  }
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const logger = {
  info: (message: string, context?: string) => log('info', message, context),
  warn: (message: string, context?: string) => log('warn', message, context),
  error: (message: string, context?: string) => log('error', message, context),
};

export function handleError(error: unknown, context?: string): string {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';
  logger.error(message, context);
  return message;
}
