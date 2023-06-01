# API documentation for JASMA

## Table of Contents

blabla

## Overview

#### Routes marked with ! require authenthication/authorization.
#### Routes marked with !! require moderator/admin authenthication/authorization.

### Auth

- POST   /api/auth/register
- POST   /api/auth/login
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

#### Description

Hello world

#### Input/Output

Good bye world

- POST   /api/auth/login
- POST   /api/auth/logout
- POST   /api/auth/checkAuth
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