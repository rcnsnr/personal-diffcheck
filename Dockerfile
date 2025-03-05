FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Set environment variable (Next.js will respect this if we don't explicitly pass '-p' in the start script)
ENV PORT=4999
EXPOSE 4999

CMD ["npm", "run", "start"]
