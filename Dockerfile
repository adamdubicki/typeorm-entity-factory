FROM node:12-slim

ENV PATH $PATH:/usr/src/app/node_modules/.bin

WORKDIR /usr/src

COPY ./package.json .
COPY ./package-lock.json .

# Install dependencies
RUN npm ci

CMD tail -f /dev/null