export const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
    });
};
