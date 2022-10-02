#!/bin/sh
sudo rm -rf app.apks &&\
sudo chmod -R 777 docker &&\
npm run build-android &&\
npm run convert-apk &&\
sudo unzip -o app.apks &&\
sudo mv universal.apk /home/bangmapleproject0/node-file-manager/files/app_`date +"%d-%m-%Y-%H:%M"`.apk &&\
sudo rm -rf universal.apk
