FROM node:alpine as build

ENV NODE_ENV production

WORKDIR /client

COPY package.json /client/package.json
COPY package-lock.json /client/package-lock.json
RUN npm i

COPY . /client/

RUN npm run build

FROM nginx:alpine as prod
COPY --from=build /client/dist /client
COPY nginx.conf /etc/nginx/nginx.conf