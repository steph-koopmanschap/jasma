# JASMA Environment Variables Documentations

## jasma-api-server  

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

## jasma-client

`BASE_URL` The URL in the browser to connect to the app. NOT USED (YET?) `(IP address or domain)` <br />
`PORT` The port of NextJS. Used to connect the user/browser to the client. NextJS Server Side Rendering. `(Integer)` <br />
`NEXT_PUBLIC_API_SERVER_URL` The IP address or domain of the API server. Used for connecting client to backend. `(IP address or domain)` <br />
`NEXT_PUBLIC_API_SERVER_PORT` The port the API server. Used for connecting client to backend. `(Integer)` <br />
`NEXT_PUBLIC_NODE_ENV` Controls if the app is started in dev or production mode. `(development / production)` <br />
`ANALYZE` Controls if the NextJS document size analyzer should be turned on. Setting this to true might crash the browser. `(true / false)` <br />
`SESSION_SECRET` NextJS session secret. NOT USED. `(String)` <br />
`NEXT_TELEMETRY_DEBUG` Controls wether to show debug and telemetry data in the console. `(1 / 0)` <br />
`NEXT_TELEMETRY_DISABLED` Controls wether to send telemetry and app usage data to Vercel. `(1 / 0)` <br />
