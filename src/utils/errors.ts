
export type ErrorCategory =
    | "LOCATION"
    | "NETWORK"
    | "TIMEOUT"
    | "API"
    | "DATA"
    | "ERROR";

export function createAppError(
    category: ErrorCategory,
    message: string
): Error {
    return new Error(`[${category}] ${message}`);
}

export function getErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
        return "[ERROR] An unexpected error occurred.";
    }

    // Preserve errors that already have a standard category.
    if (/^\[(LOCATION|NETWORK|TIMEOUT|API|DATA|ERROR)\]/.test(error.message)) {
        return error.message;
    }

    if (
        error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        error.message.toLowerCase().includes("timeout")
    ) {
        return "[TIMEOUT] The API request took too long. Please try again.";
    }

    if (error instanceof TypeError) {
        return "[NETWORK] Unable to connect. Please check your internet connection.";
    }

    if (error instanceof SyntaxError) {
        return "[DATA] The API returned an invalid response.";
    }

    if (error.message.startsWith("API Error:")) {
        return `[API] ${error.message.replace("API Error:", "").trim()}`;
    }

    return `[ERROR] ${error.message}`;
}
