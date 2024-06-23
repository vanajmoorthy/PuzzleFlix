#!/bin/bash
echo "Building server, remember to git pull prior for latest version"
docker build . --no-cache -t puzzleflix-backend
docker stop api
docker rm api
docker run -d -p 24100:24100 --name api --env APP_ENVIRONMENT=PRODUCTION puzzleflix-backend
