import {KB, MB, GB} from "../constants/fileSizes";

//Returns a number in bytes to string in human readable format
//Either bytes, KB, MB, or GB
export function bytesToHuman(bytes) {
    if (bytes < KB) 
    {
        return `${bytes} bytes`;
    } 
    else if (bytes >= KB && bytes < MB) 
    {
        return `${(bytes / KB).toFixed(1)} KB`;
    } 
    else if (bytes >= MB && bytes < GB) 
    {
        return `${(bytes / MB).toFixed(1)} MB`;
    }
    else if (bytes >= GB)
    {
        return `${(bytes / GB).toFixed(1)} GB`;
    }
}

export function formatLargeNumber(number) {
    const formatter = Intl.NumberFormat('en', {notation: "compact"});

    return formatter.format(number);
}

//Formats a raw hashtags input string to an array of hashtags
export function hashtagFormatter(hashtagsRaw) {
    //Only lower case alphabet character hashtags allowed
    let hashtagsModified = hashtagsRaw.toLowerCase().trim().replace(/[^a-z ]/g, '');
    //Each hashtag is seperated by a space. .filter removes empty hashtags created by double spaces
    let hashtagsArray = hashtagsModified.split(" ").filter(hashtag => hashtag.trim() != '');
    //remove duplicate hashtags
    hashtagsArray = hashtagsArray.filter((hashtag, index) => hashtagsArray.indexOf(hashtag) === index);

    //Limit the hashtags to only 5
    if (hashtagsArray.length > 5)
    {
        hashtagsArray.splice(5);
    }
    //Use 
    // hashtagsNormalizedString = hashtagsArray.join(" ");
    //To create a string of normalized hashtags seperated by spaces
    return hashtagsArray;
}

//FileSize and limit are both in bytes
//Returns true if file is too large
//Returns false if file is limit
export function checkFileTooLarge(fileSize, limit = 1.5 * GB) {
    if (fileSize >= limit) 
    {
        return true;
    }
    return false;
}
