# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /usr/src/app
RUN apk add --no-cache python2 g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "app.js"]
EXPOSE 3000