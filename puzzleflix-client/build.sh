#!/bin/bash
echo "Building server, remember to git pull prior for latest version"
docker build . --no-cache -t front
docker stop client
docker rm client
docker run -d -p 24600:24600 --name client front
