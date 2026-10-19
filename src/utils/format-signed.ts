// 25 -> "+25", -18 -> "−18" (real minus sign), 0 -> "0"
export function formatSigned(value: number): string {
    if (value > 0) return `+${value}`;
    return value < 0 ? `\u{2212}${Math.abs(value)}` : '0';
}
