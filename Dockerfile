FROM node:18-slim

WORKDIR /usr/src/app
COPY . .

RUN apt update
RUN apt install -y pandoc

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
