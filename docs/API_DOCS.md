# API documentation for JASMA

## Table of Contents

[Overview](#overview)
[Detailed information](#detailed-information)

## Overview

Required Header for POST, DELETE, PUT requests: `"X-CSRFTOKEN"`
The `X-CSRFTOKEN` is automatically added by Axios.

Default response structure:
```
{
    "success": Boolean,
    "message": String,
    "data": Object,
    "errors": Array
}
```

#### Routes marked with ! require authenthication/authorization.
#### Routes marked with !! require moderator/admin authenthication/authorization.

### Auth

- POST   /api/auth/login
- POST   /api/auth/register
- POST   /api/auth/logout
- POST   /api/auth/checkAuth
- POST   /api/auth/checkAuthUserRole
- ! POST /api/auth/changePassword

### Users

- ! GET    /api/users/getClientUser
- GET      /api/users/getUserId/${username}
- GET      /api/users/${userID}/UserInfo
- GET      /api/users/${userid}/profilepic
- ! PUT    /api/users/uploadProfilePic
- ! POST   /api/users/addFollower
- ! DELETE /api/users/removeFollower/${userID_two}
- GET      /api/users/${userID}/getFollowers
- GET      /api/users/${userID}/getFollowing
- ! GET    /api/users/checkIsFollowing/${userID_two}
- !! GET   /api/users/getUsersByRole
- !! PUT   /api/users/changeUserRole

### Posts

- ! POST   /api/posts/createPost
- ! DELETE /api/posts/deletePost/${postID}
- ! PUT    /api/posts/editPost
- GET      /api/posts/getUserPosts?user_id=${user_id}&limit=${limit}
- GET      /api/posts/getSinglePost/${post_id}
- GET      /api/posts/getLatestPosts?limit=${limit}
- ! GET    /api/posts/getNewsFeed
- ! POST   /api/posts/addPostBookmark
- ! DELETE /api/posts/removePostBookmark/${post_id}
- ! GET    /api/posts/getBookmarkedPosts

### Comments

- ! POST   /api/comments/createComment
- ! DELETE /api/comments/deleteComment/${commentID}
- ! PUT    /api/comments/editComment
- GET      /api/comments/getComments?post_id=${post_id}&limit=${limit}

### Search

- GET /api/search/search?q=${keyword}&filter=${filter}

### Hashtags

- GET      /api/hashtags/getTopHashtags?limit=${limit}
- GET      /api/hashtags/getHashtagCount/${hashtag}
- ! GET    /api/hashtags/getSubscribedHashtags
- ! POST   /api/hashtags/subscribeToHashtags
- ! DELETE /api/hashtags/unsubscribeFromHashtag

### Notifications

- ! GET /api/notifications/getNotifications
- ! PUT /api/notifications/readNotification

### Reports

- POST /api/reports/createReport
- !! GET /api/reports/getReports
- !! DELETE /api/reports/deleteReport/${postID}
- !! DELETE /api/reports/ignoreReport/${postID}

### Advertisements

- ! POST   /api/ads/createAd
- ! DELETE /api/ads/deleteAd/${adID}
- ! PUT    /api/ads/editAd
- ! GET    /api/ads/getAd/${adID} 
- ! GET    /api/ads/getAds

### Media

- GET /media/${mediaType}/${context}/${fileName}

## Detailed information

### POST | /api/auth/register

Register a new user.

#### Input

```
{
    "username": "test123",
    "email": "test@test.com",
    "password": "test123"
}
```

#### Output

Success example.
```
{
    "success": true,
    "message": "User test123 registered successfully.",
    "data": {},
    "errors": []
}
```
Error example.
```
{
    "success": false,
    "message": "",
    "data": {},
    "errors": [
        {
            "attr": "username",
            "code": "unique",
            "message": "A user with that username already exists."
        },
        {
            "attr": "email",
            "code": "unique",
            "message": "User with this email address already exists."
        }
    ]
}
```

### POST | /api/auth/login

Login a user.

#### Input

```
{
    "email": "test@test.com",
    "password": "test123"
}
```

#### Output

```
{
    "success": true,
    "message": "User logged in.",
    "data": {
        "user": {
            "id": "124ed254-dde4-461e-aaf5-bf0de681d9b4",
            "username": "test123",
            "email": "test@test.com"
        }
    },
    "errors": []
}
```

### POST | /api/auth/checkAuth

Check if a user is logged serverside.

#### Output



# Ignore this (temporary)
- POST   /api/auth/checkAuthUserRole
- ! POST /api/auth/changePassword

- ! GET    /api/users/getClientUser
- GET      /api/users/getUserId/${username}
- GET      /api/users/${userID}/UserInfo
- GET      /api/users/${userid}/profilepic
- ! PUT    /api/users/uploadProfilePic
- ! POST   /api/users/addFollower
- ! DELETE /api/users/removeFollower/${userID_two}
- GET      /api/users/${userID}/getFollowers
- GET      /api/users/${userID}/getFollowing
- ! GET    /api/users/checkIsFollowing/${userID_two}
- !! GET   /api/users/getUsersByRole
- !! PUT   /api/users/changeUserRole

- ! POST   /api/posts/createPost
- ! DELETE /api/posts/deletePost/${postID}
- ! PUT    /api/posts/editPost
- GET      /api/posts/getUserPosts?user_id=${user_id}&limit=${limit}
- GET      /api/posts/getSinglePost/${post_id}
- GET      /api/posts/getLatestPosts?limit=${limit}
- ! GET    /api/posts/getNewsFeed
- ! POST   /api/posts/addPostBookmark
- ! DELETE /api/posts/removePostBookmark/${post_id}
- ! GET    /api/posts/getBookmarkedPosts

- ! POST   /api/comments/createComment
- ! DELETE /api/comments/deleteComment/${commentID}
- ! PUT    /api/comments/editComment
- GET      /api/comments/getComments?post_id=${post_id}&limit=${limit}

- GET /api/search/search?q=${keyword}&filter=${filter}

- GET      /api/hashtags/getTopHashtags?limit=${limit}
- GET      /api/hashtags/getHashtagCount/${hashtag}
- ! GET    /api/hashtags/getSubscribedHashtags
- ! POST   /api/hashtags/subscribeToHashtags
- ! DELETE /api/hashtags/unsubscribeFromHashtag

- ! GET /api/notifications/getNotifications
- ! PUT /api/notifications/readNotification

- POST /api/reports/createReport
- !! GET /api/reports/getReports
- !! DELETE /api/reports/deleteReport/${postID}
- !! DELETE /api/reports/ignoreReport/${postID}

- ! POST   /api/ads/createAd
- ! DELETE /api/ads/deleteAd/${adID}
- ! PUT    /api/ads/editAd
- ! GET    /api/ads/getAd/${adID} 
- ! GET    /api/ads/getAds

- GET /media/${mediaType}/${context}/${fileName}