export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") return;

    const { logger } = await import("@/lib/logger");
    const originalConsole = {
        error: console.error.bind(console),
        warn: console.warn.bind(console),
        log: console.log.bind(console),
    };

    console.error = (...args: unknown[]) => {
        logger.error("Console error", args);
        originalConsole.error(...args);
    };

    console.warn = (...args: unknown[]) => {
        logger.warn("Console warning", args);
        originalConsole.warn(...args);
    };

    console.log = (...args: unknown[]) => {
        logger.info("Console message", args);
        originalConsole.log(...args);
    };

    logger.step("Application logging initialized", {
        logFile: "logs/application.log.txt",
    });
}
