FROM node:latest

RUN npm install --global nodemon

WORKDIR /usr/src/authenticationservice

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
