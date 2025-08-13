export const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1_000_000n));
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
    });
};

export function dateToBigInt(date: Date | string): bigint {
    const d = typeof date === "string" ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        throw new Error("Invalid date provided");
    }

    return BigInt(d.getTime()) * 1_000_000n;
}