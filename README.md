

# FPTU Library Booking Management System


🔎 **Smart, Fast and Extensible Build System**

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- NodeJS 16.17.0 / npm 8 
- NextJS 12
- React 17
- React Native 0.67.4
- NestJS 8
- Mantine UI
- Heroicons

`Ubuntu Server 22.04, PostgreSQL 14, Keycloak 17`

## To use this system

Run `docker compose up -d` to generate a working local environment.

- Run `npm run backend` to run local backend environment.
- Run `npm run frontend` to run local frontend environment.
- Run `npm run android` to run local android environment.
- Run `npm run ios` to run local iOS environment. (Require XCode local development profile).

- Run `npm run build-backend` to build a production backend environment.
- Run `npm run build-frontend` to build a production frontend environment.
- Run `npm run build-android` to build a production Android environment.
- Run `npm run convert-apk` to sign and export bundled Android application to APK file.
- Run `npm run pod-install` to install Pod dependencies for iOS local environment before running.
