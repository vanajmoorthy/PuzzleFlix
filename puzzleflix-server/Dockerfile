FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install --global nodemon
EXPOSE 24100
CMD ["npm", "run", "start"]
