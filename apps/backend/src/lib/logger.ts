type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const isDev = process.env.NODE_ENV !== "production";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const minLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || (isDev ? "debug" : "info");

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[minLevel];
}

function format(level: LogLevel, context: LogContext, message: string): string {
  const timestamp = new Date().toISOString();
  const ctx = Object.keys(context).length ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${ctx}`;
}

function emit(
  level: LogLevel,
  contextOrMessage: LogContext | string,
  message?: string
): void {
  if (!shouldLog(level)) return;

  let context: LogContext = {};
  let msg: string;

  if (typeof contextOrMessage === "string") {
    msg = contextOrMessage;
  } else {
    context = contextOrMessage;
    msg = message ?? "";
  }

  const line = format(level, context, msg);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (context: LogContext | string, message?: string) =>
    emit("debug", context, message),
  info: (context: LogContext | string, message?: string) =>
    emit("info", context, message),
  warn: (context: LogContext | string, message?: string) =>
    emit("warn", context, message),
  error: (context: LogContext | string, message?: string) =>
    emit("error", context, message),
};