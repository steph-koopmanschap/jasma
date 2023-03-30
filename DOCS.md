# JASMA Documentation

## Tech Stack:

Frontend:
- NextJS / React
- TailwindCSS
- React Query
- Recoil
- Axios
- Font Awesome

Backend:
- ExpressJS
- PostGreSQL
- Redis
- NodeJS
- Sequelize

## Getting started

### Prerequisites

- Install PostGreSQL <br />
`sudo apt install postgresql` <br />
- Install Redis <br /> 
`sudo apt install redis-server` <br />
- Install NPM  <br />
`sudo apt install npm` <br />
- Install NodeJS  <br />
`sudo apt install nodejs` <br />
- Install pm2, nginx (for production) <br />
`npm install pm2 -g`

Install the minimal requirements to start development: <br />
`sudo apt install nodejs npm redis-server postgresql` 

### Install node modules

In the root folder: <br />
`npm run installAll` 

#### Setup environment variables

Make sure to copy the following files and then edit them to setup the environment variables <br />
from `/express/.env.example` to `/express/.env` <br />
and from `/next/.env.example` to `/next/.env.development`

For local development you can keep the defaults. <br />
For production change HOSTNAME and NEXTJS_ORIGIN to your domain name or ip address. <br />
Change the ports accordingly as well as the PG_ADMIN_PASSWORD.

### Setting up the database

<!-- First read /server/db/pg_hba.conf to read on what to add to your pg_hba.conf file. -->
After you have installed PostGreSQL. You can execute the following command to change the PSQL root user password.
- `sudo -u postgres psql --echo-queries -c "ALTER ROLE postgres WITH LOGIN PASSWORD 'example';"` <br />
Change 'example' into a password of your liking. Make sure its the same as in the `/express/.env` file. <br />
To create the database do the following command:
- `npm run db:init` <br />
 To populate the database with fake users, posts, and comments. Replace 10 with the amount of each you want to generate.
- `npm run db:generate 10`

### Starting the app

There are several methods to start the app from the root directory.
- `npm run dev` Starts the API, media, and client servers in 1 terminal, in development mode with live reloading (nodemon/next).
- `npm run start` Starts the API, media, and client servers in 1 terminal, in production mode.
- `npm run dev:all` Same as `npm run dev`, but every server starts in its own terminal.
- `npm run start:all` Same as `npm run start`, but every server starts in its own terminal.
- `npm run start:pm2` Starts all servers as background proccesses without terminals. Requires pm2 to be installed.
- Use `npm run` to see all available commands.
- With `npm run check:services` you can see if Redis, PostgreSQL, Nginx, and pm2 are running and which ports are being listened on.
- Make sure to use the command `npm run build` before starting NextJS in production mode. (any command with `start`).

You can also independently start each server with the commands.
- `cd express && npm run dev`
- `cd next && npm run dev`
- `cd media-server && npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
API server lives on [http://localhost:5000/api](http://localhost:5000/api)

### Setting up production

To get started with a production server you can run: 
- `sudo ./setup.sh`
This will set up everything you need automatically.

## API Routes

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

### Advertisements

- ! POST   /api/ads/createAd
- ! DELETE /api/ads/deleteAd/${adID}
- ! PUT    /api/ads/editAd
- ! GET    /api/ads/getAd/${adID} 
- ! GET    /api/ads/getAds

## Learn More

External documentation of 3rd party libraries, frameworks, and tools.

- [Next.js Docs](https://nextjs.org/docs)
- [React.js Docs](https://reactjs.org/docs/getting-started.html)
- [React Query Docs](https://react-query-v2.tanstack.com/overview)
- [Recoil Docs](https://recoiljs.org/docs/introduction/getting-started/)
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation)
- [Axios Docs](https://axios-http.com/docs/intro)
- [NPM Docs](https://docs.npmjs.com/)
- [Sequelize SQL ORM Docs](https://sequelize.org/docs/v6/)
- [PostGreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Docs](https://redis.io/docs/)
- [Express.js Docs](https://expressjs.com/en/guide/routing.html)
- [Date FNS Docs](https://date-fns.org/docs/Getting-Started)
- [Font Awesome Docs](https://fontawesome.com/docs)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Paypal Developer Docs](https://developer.paypal.com/docs/online/)
- [Docker Docs](https://docs.docker.com)