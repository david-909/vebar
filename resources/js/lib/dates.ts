/** "2026-10-18" -> "18.10.2026." (Serbian date format). */
export function formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');

    return `${day}.${month}.${year}.`;
}
