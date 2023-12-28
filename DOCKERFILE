FROM node:18.16.0-bullseye-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
