FROM node:alpine AS development
COPY . /api-server
WORKDIR /api-server
RUN npm install
RUN npm run db:init
RUN npm run db:resetTables
RUN npm run db:generate 100
CMD ["npm", "run", "dev"]

FROM node:alpine AS production
COPY . /api-server
WORKDIR /api-server
RUN npm install
RUN npm run db:init
RUN npm run db:resetTables
CMD ["npm", "run", "start"]
