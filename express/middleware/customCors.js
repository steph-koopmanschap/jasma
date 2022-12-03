//A better custom implementation of cors.
//Should be at or near the top of the middleware stack
function customCors(app) {
    app.use((req, res, next) => {
        const allowedOrigins = ['http://127.0.0.1:3000', 
                                'http://localhost:3000',
                                process.env.NEXTJS_ORIGIN];
        const origin = req.headers.origin;

        if (allowedOrigins.includes(origin)) 
        {
            res.set({'Access-Control-Allow-Origin': origin});
        }

        res.set({
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,HEAD,OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization,Content-Type,Accept,Content-Encoding,X-Requested-With,x-api-user,x-api-key,x-client',
            'Access-Control-Allow-Credentials': true,
             //Rate limit headers for CORS requests
            'Access-Control-Expose-Headers': 'X-RateLimit-Limit,X-RateLimit-Remaining,X-RateLimit-Reset,Retry-After'
        });
        
        return next();
    });
}

module.exports = customCors;
