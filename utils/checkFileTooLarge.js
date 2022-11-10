import {GB} from "../constants/fileSizes";

//FileSize and limit are both in bytes
//Returns true if file is too large
//Returns false if file is limit
export default function checkFileTooLarge(fileSize, limit = 1.5 * GB) {
    if (fileSize >= limit) 
    {
        return true;
    }
    return false;
}
