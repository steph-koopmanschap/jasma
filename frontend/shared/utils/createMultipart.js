export function createMultipartData(data, file) {
    const formData = new FormData();

    for (const key in data) {
        const value = data[key];
        formData.append(key, value);
    }

    if (file) {
        formData.append("file", file);
    }

    return formData;
}
