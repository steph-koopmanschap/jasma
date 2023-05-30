# JASMA (OLD) Documentation

## NOTE: THIS DOCUMENTATION IS DEPRECATED

## Table of Contents

- [JASMA (OLD) Documentation](#jasma-old-documentation)
  - [NOTE: THIS DOCUMENTATION IS DEPRECATED](#note-this-documentation-is-deprecated)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack:](#tech-stack)
    - [Frontend:](#frontend)
    - [Backend:](#backend)
    - [Testing:](#testing)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Install node modules](#install-node-modules)
      - [Configure environment variables](#configure-environment-variables)
  - [Getting started with Docker](#getting-started-with-docker)
    - [Prerequisites](#prerequisites-1)
    - [Configure Docker environment variables](#configure-docker-environment-variables)
    - [Starting the app with docker.](#starting-the-app-with-docker)
  - [Environment variables explained](#environment-variables-explained)
    - [jasma-api-server](#jasma-api-server)
    - [jasma-client](#jasma-client)
  - [api documentation](#api-documentation)
  - [testing documentation](#testing-documentation)
  - [External documentation of 3rd party libraries, frameworks, and tools](#external-documentation-of-3rd-party-libraries-frameworks-and-tools)

## Tech Stack:

### Frontend:

- NextJS / React
- TailwindCSS
- React Query
- Recoil
- Axios
- Font Awesome

### Backend:

- Django / Python
- PostGreSQL
- Redis

### Testing:

- PyUnit (unittest)
- Selenium

## Getting started

NOTE: The most easiest way to quickly get started is by using Docker.
      Go to 'Getting started with Docker' to read more about this.

### Prerequisites

- Install PostGreSQL <br />
`sudo apt install postgresql` <br />
- Install NPM  <br />
`sudo apt install npm` <br />
- Install NodeJS  <br />
`sudo apt install nodejs` <br />


Install the minimal requirements to start development: <br />
`sudo apt install nodejs npm redis-server postgresql` 

### Install node modules

In the root folder: <br />
`npm run installAll` 

#### Configure environment variables

Make sure to copy the following files and then edit them to setup the environment variables <br />
from `/express/.env.example` to `/express/.env` <br />
and from `/next/.env.example` to `/next/.env.development` <br />
DO NOT EDIT OR RENAME `.env.example` DIRECTLY! <br />
Use the following command to copy the files:  <br />
`cd express && cp .env.example .env && cd ../next && cp .env.example .env.development`

For local development you can keep the default environment variables. <br />
For production change HOSTNAME and NEXTJS_ORIGIN to your domain name or ip address. <br />
Change the ports accordingly as well as the PG_ADMIN_PASSWORD.

## Getting started with Docker

### Prerequisites

First you need to install Docker. Note that that this app has not yet been tested with Docker Desktop. <br />
`sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin` <br />
For detailed installation instruction go to the [docker installation manual](https://docs.docker.com/engine/install/)

Once docker is installed copy either `docker-compose-production.yml` or `docker-compose-development.yml` to `docker-compose.yml`.  <br />
Use the following command to do so: <br />
`cp docker-compose-development.yml docker-compose.yml` <br />

NOTE: If you are running the postgresql, redis, or nginx services on your host machine you need to turn them off  <br />  
      Or else you might connect to those services instead of the docker services.  <br />
      You can stop those services with the following commands:
```
sudo systemctl stop postgresql
sudo systemctl stop redis-server
sudo systemctl stop nginx
# Optional: Check the status of each service to make sure they stopped.
sudo systemctl status postgresql 
sudo systemctl status redis-server
sudo systemctl status nginx
```
It may be possible run both these services on your host machine and in the docker containers,  <br />
if the docker containers have differents (external) ports for those containers.

### Configure Docker environment variables

You may need to change a few environment variables in your `docker-compose.yml` file. <br />
If this is your very first time starting the app with Docker then you need to set the following environment variable to `true` <br />
`START_FIRST_TIME=true` <br />
After the containers have started you need to change it to `START_FIRST_TIME=false`. <br />
This will env variable will delete any postgresql databases that exist for the app and then create a new one when it is set to `true`. <br />

If you are using Docker for production then change the following environment variables to your host machine IP address or your domain name. <br /> 
Example:
```
NEXTJS_ORIGIN=http://192.168.1.10
NEXT_PUBLIC_API_SERVER_URL=192.168.1.10
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
API server lives on [http://localhost:8000/api](http://localhost:8000/api)

### Starting the app with docker.

To start the app with docker and rebuild the docker images (if there are code changes or ENV variable changes) use the following command: <br />
`docker compose up --build` <br />
(Use CTRL+C to shut down the containers) <br />
To start the app with docker without rebuilding the images use the following command: <br />
`docker compose up` <br />
To stop the app use the following command: <br />
`docker compose down` <br />
To check if the app containers are running and on which ports use the following command: <br />
`docker ps`

## Environment variables explained

Note that these environment variables are referenced from the docker-compose file. 
The env variables in the .env files might be slightly different.

### jasma-api-server  

`START_FIRST_TIME` Controls if the PSQL database is re-created on server startup. `(true / false)` <br />
`STAGE` Controls if the app is started in dev or production mode. `(development / production)` <br />
`HOSTNAME` Controls the hostname of the server. NOT USED (YET?). <br />
`PORT` Controls the port of the API server. `(Integer)` <br />
`SESSION_SECRET` Controls the session secret of the cookies stored in Redis. `(String)` <br />
`NEXTJS_ORIGIN` The IP address or domain of NextJS. Used for CORS policy. `(IP address or domain)` <br />
`NEXTJS_PORT` Making sure the server knows what port NextJS is using. Used for CORS policy `(Integer)` <br />
`PG_SUPER_USER` The username for logging in to postgresql as the root super user. `(String)` <br />
`PG_SUPER_PASSWORD` The password for logging in to postgresql as the root super user. `(String)` <br /> 
`PG_ADMIN_USER` The username for managing the jasma postgresql database. `(String)` <br />
`PG_ADMIN_PASSWORD` The password for managing the jasma postgresql database. `(String)` <br />
`PG_HOST` The hostname for connecting to postgresql. `(IP address or domain)` <br />
`PG_PORT` The port for connecting to postgresql. `(Integer)` <br />
`PG_SUPER_DATABASE` The name of the root / super database in postgresql. `(String)` <br />
`PG_ADMIN_DATABASE` The name of the jasma database in postgresql. `(String)` <br />
`REDIS_HOST` The hostname for connecting to redis. `(IP address or domain)` <br />
`REDIS_PORT` The port for connecting to redis. `(Integer)` <br />
`PAYPAL_SECRET` The Paypal secret of your Paypal account. Used for accepting payments. `(String)` <br />
`PAYPAL_CLIENT_ID_SANDBOX` The client ID of your Paypal App. For testing and development. Uses fake money. `(String)` <br />
`PAYPAL_CLIENT_ID_PRODUCTION` The client ID of your Paypal App. For production. Uses real money. `(String)` <br />
`STRIPE_SECRET_KEY` The Stripe secret of your Stripe account. Used for accepting payments. `(String)` <br />

### jasma-client

`BASE_URL` The URL in the browser to connect to the app. NOT USED (YET?) `(IP address or domain)` <br />
`PORT` The port of NextJS. Used to connect the user/browser to the client. NextJS Server Side Rendering. `(Integer)` <br />
`NEXT_PUBLIC_API_SERVER_URL` The IP address or domain of the API server. Used for connecting client to backend. `(IP address or domain)` <br />
`NEXT_PUBLIC_API_SERVER_PORT` The port the API server. Used for connecting client to backend. `(Integer)` <br />
`NEXT_PUBLIC_NODE_ENV` Controls if the app is started in dev or production mode. `(development / production)` <br />
`ANALYZE` Controls if the NextJS document size analyzer should be turned on. Setting this to true might crash the browser. `(true / false)` <br />
`SESSION_SECRET` NextJS session secret. NOT USED. `(String)` <br />
`NEXT_TELEMETRY_DEBUG` Controls wether to show debug and telemetry data in the console. `(1 / 0)` <br />
`NEXT_TELEMETRY_DISABLED` Controls wether to send telemetry and app usage data to Vercel. `(1 / 0)` <br />

## api documentation

Click here ()[] to see the full API documentation.

## testing documentation

Click here ()[] to see the full testing documentation.

## External documentation of 3rd party libraries, frameworks, and tools

- [Next.js Docs](https://nextjs.org/docs)
- [React.js Docs](https://reactjs.org/docs/getting-started.html)
- [React Query Docs](https://react-query-v2.tanstack.com/overview)
- [Recoil Docs](https://recoiljs.org/docs/introduction/getting-started/)
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation)
- [Axios Docs](https://axios-http.com/docs/intro)
- [NPM Docs](https://docs.npmjs.com/)
- [Django REST Framework docs](https://www.django-rest-framework.org/)
- [PostGreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Docs](https://redis.io/docs/)
- [Date FNS Docs](https://date-fns.org/docs/Getting-Started)
- [Font Awesome Docs](https://fontawesome.com/docs)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Paypal Developer Docs](https://developer.paypal.com/docs/online/)
- [Docker Docs](https://docs.docker.com)
