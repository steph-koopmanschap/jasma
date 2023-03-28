FROM node:alpine
COPY . /api-server
WORKDIR /api-server
CMD npm run db:init && npm run db:resetTables && npm run 
