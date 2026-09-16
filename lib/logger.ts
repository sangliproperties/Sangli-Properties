import fs from "fs";
import path from "path";

type LogLevel = "INFO" | "STEP" | "WARN" | "ERROR";

const logsDirectory = path.join(process.cwd(), "logs");
const logFile = path.join(logsDirectory, "application.log.txt");

function formatValue(value: unknown): string {
    if (value instanceof Error) {
        return `${value.name}: ${value.message}${value.stack ? `\n${value.stack}` : ""}`;
    }

    if (typeof value === "string") return value;

    try {
        return JSON.stringify(value, (_, nestedValue) => {
            if (
                typeof _ === "string" &&
                /password|secret|token|authorization|cookie|phone/i.test(_)
            ) {
                return "[REDACTED]";
            }
            return nestedValue;
        });
    } catch {
        return String(value);
    }
}

function write(level: LogLevel, message: string, details?: unknown) {
    const timestamp = new Date().toISOString();
    const suffix = details === undefined ? "" : ` | ${formatValue(details)}`;
    const line = `[${timestamp}] [${level}] ${message}${suffix}\n`;

    try {
        fs.mkdirSync(logsDirectory, { recursive: true });
        fs.appendFileSync(logFile, line, "utf8");
    } catch (loggingError) {
        // Logging must never prevent the application from serving a request.
        process.stderr.write(`Unable to write application log: ${formatValue(loggingError)}\n`);
    }
}

export const logger = {
    info(message: string, details?: unknown) {
        write("INFO", message, details);
    },
    step(message: string, details?: unknown) {
        write("STEP", message, details);
    },
    warn(message: string, details?: unknown) {
        write("WARN", message, details);
    },
    error(message: string, error?: unknown, details?: unknown) {
        write("ERROR", message, {
            error: formatValue(error),
            details,
        });
    },
};

export const applicationLogFile = logFile;
