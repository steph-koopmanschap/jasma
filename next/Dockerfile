FROM node:alpine AS development
COPY . /client
WORKDIR /client
RUN npm install
RUN npx next telemetry disable
CMD ["npm", "run", "dev"]

FROM node:alpine AS production
COPY . /client
WORKDIR /client
RUN npm install
RUN npx next telemetry disable
RUN npm run build
CMD ["npm", "run", "start"]
