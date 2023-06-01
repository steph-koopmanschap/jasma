import { KB, MB, GB } from "../constants/fileSizes";

//Returns a number in bytes to string in human readable format
//Either bytes, KB, MB, or GB
export function bytesToHuman(bytes) {
    if (bytes < KB) {
        return `${bytes} bytes`;
    } else if (bytes >= KB && bytes < MB) {
        return `${(bytes / KB).toFixed(1)} KB`;
    } else if (bytes >= MB && bytes < GB) {
        return `${(bytes / MB).toFixed(1)} MB`;
    } else if (bytes >= GB) {
        return `${(bytes / GB).toFixed(1)} GB`;
    }
}
