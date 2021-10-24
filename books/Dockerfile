FROM node:latest

RUN npm install --global nodemon

WORKDIR /usr/src/bookservice

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST 0.0.0.0
EXPOSE 8082

CMD ["npm", "start"]
