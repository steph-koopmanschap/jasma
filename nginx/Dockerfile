FROM nginx:mainline-alpine AS development
RUN rm /etc/nginx/conf.d/default.conf
COPY jasmaHTTP.conf /etc/nginx/conf.d/default.conf

FROM nginx:mainline-alpine AS production
RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/ssl
COPY jasmaHTTPS.conf /etc/nginx/conf.d/default.conf


