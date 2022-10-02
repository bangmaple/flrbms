#!/bin/sh
git pull &&\
npm run build-backend &&\
docker compose up backend -d --force-recreate &&\
echo "Deploy backend successfully"
