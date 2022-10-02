import {DocumentBuilder} from '@nestjs/swagger';

export const SWAGGER_CONFIG = {
  contextPath: '/',
  app: {
    title: 'FPTU Library Room Booking Management',
    description:
      'Room booking and management for easily access for the lecturers and students',
    version: '1.0',
  },
};

export const getSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.app.title)
    .setDescription(SWAGGER_CONFIG.app.description)
    .setVersion(SWAGGER_CONFIG.app.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'access-token'
    )
    .addOAuth2()
    .build();
};
