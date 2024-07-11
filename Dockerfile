FROM node:18-alpine

RUN apk add --no-cache bash

COPY . /quora

WORKDIR /quora

RUN npm install

CMD node index.js && cd app; PORT=3015 npm start



