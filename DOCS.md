# JASMA Documentation

Tech Stack:

Frontend:
- NextJS / React
- TailwindCSS

Backend
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

### Frontend and Backend

In the root folder:
To install all node modules. 
`npm run installAll` 
To run client and server at same time (in development mode)
`npm run dev`
See all available scripts
`npm run`

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

First read /server/db/pg_hba.conf to read on what to add to your pg_hba.conf file.
Create the database
`npm run db:init`

<!-- To populate the database with 10 fake users
`npm run resetAndPopulateUsers normal 10` -->

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
