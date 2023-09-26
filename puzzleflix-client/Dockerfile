FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV VITE_ENVIRONMENT=PRODUCTION
RUN npm run build
EXPOSE 24600
CMD ["npm", "run", "serve"]
