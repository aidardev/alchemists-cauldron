function pad(value: number): string {
    return String(value).padStart(2, '0');
}

export function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
