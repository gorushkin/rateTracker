FROM node:19-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
RUN npm install

COPY src ./src
COPY prisma ./prisma

RUN npm run db:deploy
RUN npm run build

CMD node dist/index.js
