FROM node:alpine

WORKDIR /server

COPY package.json /server/package.json
COPY package-lock.json /server/package-lock.json
COPY deploy.production.sh /server/deploy.production.sh
COPY ./prisma /server/prisma
RUN npm i --include=dev

COPY ./src /server/src
COPY tsconfig.json /server

RUN npm run build

EXPOSE 8800

CMD ["./deploy.production.sh"]