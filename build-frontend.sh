#!/bin/sh
git pull &&\
pm2 delete frontend || true &&\
npm run build-frontend &&\
cd apps/frontend/build &&\
pm2 start npm --name "frontend" -- start
