export function formatLargeNumber(number) {
    const formatter = Intl.NumberFormat("en", { notation: "compact" });

    return formatter.format(number);
}
