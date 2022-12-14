//Formats a raw hashtags input string to an array of hashtags
export default function hashtagFormatter(hashtagsRaw) {
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
    //Limit each hashtag to only 50 characters
    hashtagsArray.forEach((hashtag) => {
        if (hashtag.length > 50)
        {
            hashtag.splice(50);
        }
    });
    
    //Use 
    // hashtagsNormalizedString = hashtagsArray.join(" ");
    //To create a string of normalized hashtags seperated by spaces
    return hashtagsArray;
}
