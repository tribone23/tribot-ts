FROM node:18-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install pm2 -g

CMD ["pm2-runtime", "dist/index.js"]