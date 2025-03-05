# Dockerfile for personal-diffcheck project
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4999

CMD ["npm", "run", "start"]
