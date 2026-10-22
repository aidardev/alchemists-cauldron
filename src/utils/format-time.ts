export function formatTime(seconds: number): string {
    const totalSeconds = Math.max(0, Math.ceil(seconds));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const remainder = String(totalSeconds % 60).padStart(2, '0');

    return `${minutes}:${remainder}`;
}
