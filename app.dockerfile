FROM node:23.5

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app/ .
COPY .env .

CMD ["node", "index.js"]