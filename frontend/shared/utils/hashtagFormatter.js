//Formats a raw hashtags input string to an array of hashtags
export function hashtagFormatter(hashtagsRaw, limit) {
    //Only lower case alphabet character hashtags allowed
    let hashtagsModified = hashtagsRaw
        .toLowerCase()
        .trim()
        .replace(/[^a-z ]/g, "");
    //Each hashtag is seperated by a space. .filter removes empty hashtags created by double spaces
    let hashtagsArray = hashtagsModified.split(" ").filter((hashtag) => hashtag.trim() != "");
    //remove duplicate hashtags
    //OLD SYNTAX: hashtagsArray = hashtagsArray.filter((hashtag, index) => hashtagsArray.indexOf(hashtag) === index); //OLD CODE (DO NOT DELETE)
    hashtagsArray = [...new Set(hashtagsArray)]; //NEW CODE SUGGESTED BY CHATGPT
    //Limit the hashtags to only the specificed limit
    if (hashtagsArray.length > limit) {
        hashtagsArray.splice(limit);
    }
    //Limit each hashtag to only 50 characters
    hashtagsArray.forEach((hashtag) => {
        if (hashtag.length > 50) {
            hashtag.splice(50);
        }
    });

    //Use
    // hashtagsNormalizedString = hashtagsArray.join(" ");
    //To create a string of normalized hashtags seperated by spaces
    return hashtagsArray;
}
