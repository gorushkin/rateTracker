FROM node:20-alpine

RUN apk add --no-cache python3 make g++
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./
RUN npm install

COPY src ./src

RUN npm run build

CMD npm run start
