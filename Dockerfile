FROM node:19-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src

RUN npm run build

CMD node dist/index.js
