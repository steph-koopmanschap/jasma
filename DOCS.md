# JASMA Documentation

Tech Stack:

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

- Install PostGreSQL
- Install Redis
- Install NodeJS
- Install NPM
- Install Nginx (For production deployment)

### Frontend and Backend

In the root folder:
To install all node modules. 
`npm run installAll` 
To run client and server at same time (in development mode)
`npm run dev`
See all available scripts
`npm run`

#### Setup environment variables
Make sure to copy the following files and then edit them to setup the environment variables 
/express/.env.example to /express/.env
/next/.env.example to /next/.env.development

### Frontend

Inside the /next/ folder:
Run the development server:
`npm run dev`
To build and run regular server:
`npm run build && npm run start`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend

Inside the /express/ folder:
Development server (nodemon reloading):
`npm run dev`
Regular server
`npm run start`

API server lives on [http://localhost:5000/api](http://localhost:5000/api)

### Database

<!-- First read /server/db/pg_hba.conf to read on what to add to your pg_hba.conf file. -->
Create the database
`npm run db:init`

 To populate the database with fake users, posts, and comments. Replace 10 with the amount of each you want to generate.
`npm run db:generate 10`

### Production

To get started with a production server you can run: 
`sudo ./setup.sh`
This will set up everything you need automatically.

## API Routes

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- POST /api/auth/checkAuth
- POST /api/auth/changePassword

- GET  /api/users/getUserId/${username}
- GET  /api/users/${userID}/UserInfo
- GET  /api/users/${userid}/profilepic

- POST /api/posts/createPost
- DELETE /api/posts/deletePost/${postID}
- PUT  /api/posts/editPost
- GET  /api/posts/getUserPosts?user_id=${user_id}&limit=${limit}
- GET  /api/posts/getLatestPosts?limit=${limit}

- POST /api/comments/createComment
- DELETE /api/comments/deleteComment/${commentID}
- PUT  /api/comments/editComment
- GET  /api/comments/getComments?post_id=${post_id}&limit=${limit}

- GET  /api/search/search?q=${keyword}&filter=${filter}

## Learn More

External documentation of 3rd party libraries and frameworks

- [Next.js Docs](https://nextjs.org/docs)
- [React.js Docs](https://reactjs.org/docs/getting-started.html)
- [React Query Docs](https://react-query-v2.tanstack.com/overview)
- [Recoil](https://recoiljs.org/docs/introduction/getting-started/)
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation)
- [Axios Docs](https://axios-http.com/docs/intro)
- [NPM Docs](https://docs.npmjs.com/)
- [Sequelize SQL ORM Docs](https://sequelize.org/docs/v6/)
- [PostGreSQL Docs](https://www.postgresql.org/docs/)
- [Express.js Docs](https://expressjs.com/en/guide/routing.html)
- [Date FNS Docs](https://date-fns.org/docs/Getting-Started)
- [Font Awesome Docs](https://fontawesome.com/docs)
