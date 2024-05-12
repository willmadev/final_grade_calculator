FROM node:alpine


ENV NODE_ENV production
ENV PORT 8800

WORKDIR /server

COPY package.json /server/package.json
COPY package-lock.json /server/package-lock.json
COPY ./prisma /server/prisma
RUN npm i --include=dev

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL

COPY ./src /server/src
COPY tsconfig.json /server

RUN npm run build

EXPOSE 8800

CMD ["node", "dist/server.js"]