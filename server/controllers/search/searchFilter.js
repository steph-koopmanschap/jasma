const searchPostsHashtags = require('./searchPostsHashtags.js');
const searchPostsText = require('./searchPostsText.js');
const searchComments = require('./searchComments.js');
const searchUsers = require('./searchUsers.js');

//This function is used to filter the search into a specific type.
async function searchFilter(keywords, limit, filter = 'hashtags') {
    switch (filter) 
    {
        case 'hashtags':
            return await searchPostsHashtags(keywords, limit);

        case 'posttext':
            return await searchPostsText(keywords, limit);

        case 'comments':
            return await searchComments(keywords, limit);

        case 'users':
            return await searchUsers(keywords, limit);

        default:
            break;
    }
}

module.exports = searchFilter;
