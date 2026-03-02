/**
* Convert Postgres tstzrange string into readable check-in/check-out dates
* @param range - e.g. ["2026-03-03 04:00:00+00","2026-03-06 06:00:00+00")
* @returns [checkIn, checkOut] as formatted dates
*/

export function parseBookingRange(range: string): [string, string] {
    const [startRaw, endRaw] = range.replace(/[\[\]"]/g, "").split(",")

    const start = startRaw.trim()
    const end = endRaw.replace(/\)$/, "").trim()

    const checkIn = new Date(start).toLocaleDateString()
    const checkOut = new Date(end).toLocaleDateString()

    return [checkIn, checkOut]
}