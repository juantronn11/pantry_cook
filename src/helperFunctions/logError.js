export async function logError(message, component = 'unknown', userId = null) {
    try {
        await fetch('/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, component, userId }),
        });
    } catch {
        // intentionally silent — if logging fails we don't want a recursive error loop
    }
}
