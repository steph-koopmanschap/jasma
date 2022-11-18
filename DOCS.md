# JASMA Documentation

Tech Stack:

Frontend:
- NextJS / React
- TailwindCSS

Backend
- ExpressJS
- PostGreSQL
- NodeJS
- node-postgres (psql interface)

## Getting started

### Frontend

First, run `./setup.sh` or `npm run setup`
Then run the development server:
`npm run dev`
To build and run regular server:
`npm run build && npm run start`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend

Inside the /server/ folder:
Development server (nodemon reloading):
`npm run dev`
Regular server
`npm run start`

API server lives on [http://localhost:3001/api](http://localhost:3001/api)

### Database

Inside the /server/ folder:
Create the database
`npm run initdb`
To populate the database with 10 fake users
`npm run resetAndPopulateUsers normal 10`

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
