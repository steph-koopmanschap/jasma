export const copyToClipboard = (value) => {
    navigator.clipboard.writeText(`${value}`);
};
