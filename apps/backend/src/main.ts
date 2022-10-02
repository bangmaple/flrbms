import {Logger, PipeTransform, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {SwaggerModule} from '@nestjs/swagger';
import {getSwaggerConfig, SWAGGER_CONFIG,} from './app/constants/config/swagger.config';
import {AppModule} from './app/modules';
import {initializeFirebaseApp} from './app/config/firebase.config';
import * as net from 'net';
import {fastifyHelmet} from 'fastify-helmet';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';
import compression from 'fastify-compress';
import {contentParser} from 'fastify-multer';
import {environment} from "./environments/environment";
// workaround to have "pg" added in package.json from dist
export * from 'pg';

const DEFAULT_PORT = 5000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_CONTEXT_PATH = '/api';
const EXTERNAL_TEST_URL = {port: 80, host: 'google.com'};

type NestApplication = NestFastifyApplication;

const validationPipe = new ValidationPipe({
  transform: true,
});

const adapter = new FastifyAdapter({
  logger: true,
});

const mainModule = AppModule.forRoot();

const extraOptions = {bufferLogs: true};

async function registerModules(app: NestApplication) {
  await app.register(contentParser);
  if (environment.production) {
    await app.register(compression);
    await app.register(fastifyHelmet, environment.helmet);
  }
}

async function registerPipes(app: NestApplication, pipes: PipeTransform<any>[]) {
  app.useGlobalPipes(...pipes);
}

function registerSwagger(app: NestApplication) {
  const document = SwaggerModule.createDocument(app, getSwaggerConfig());
  SwaggerModule.setup(SWAGGER_CONFIG.contextPath, app, document);
}

async function bootstrap() {
  const port = process.env.BACKEND_PORT || DEFAULT_PORT;
  const host = process.env.BACKEND_HOST || DEFAULT_HOST;
  const contextPath = process.env.BACKEND_CONTEXT_PATH || DEFAULT_CONTEXT_PATH;
  const firebaseProjectId = initializeFirebaseApp();

  const app = await NestFactory.create<NestApplication>(mainModule, adapter, extraOptions);
  await registerPipes(app, [
    validationPipe
  ]);

  app.setGlobalPrefix(contextPath);
  app.enableCors();
  registerSwagger(app);
  await registerModules(app);

  await app.listen(port, host);

  const client = net.connect(EXTERNAL_TEST_URL, () => {
    Logger.debug(`💻 [IP] External Address: ${client.localAddress}`);
    Logger.debug(`⚙️ [IP] Loopback Address: localhost (127.0.0.1)`);
    Logger.debug(
      `[Firebase] Initialized with project id: ${firebaseProjectId}`
    );

    Logger.debug(`[Production Mode]: ${environment.production}`);
    Logger.debug(
      `[API] Running on: http://${client.localAddress}:${port}${contextPath}`
    );
  });
}

void bootstrap();
