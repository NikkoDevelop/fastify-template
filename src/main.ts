import 'reflect-metadata';

import fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

import { Logger } from '@Service/logger';
import { Config } from '@Service/config';

const whitelist: string[] = ['http://localhost:3000'];

async function bootstrap() {
  const winston = new Logger('bootstrap');

  const config = await Config.create();

  const app = fastify();

  await app.register(cookie, {
    parseOptions: {},
    secret: config.data.settings.cookieSecret,
  });

  await app.register(cors, {
    allowedHeaders: ['*'],
    credentials: true,
    origin: (origin, callback) => {
      if (origin === undefined) {
        callback(null, false);
      } else if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  });

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Fastify Template',
        description: 'Fastify Template swagger API',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
  });

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  await app.ready().then(
    () => {},
    (err) => {
      winston.logger.error('an error happened', err);
    },
  );

  app.listen(
    {
      host: '0.0.0.0',
      port: parseInt(config.data.port),
    },
    (err) => {
      if (err) {
        winston.logger.error(err?.message);
      }
      winston.logger.info(`Server started at http://0.0.0.0:${config.data.port}`);
    },
  );
}

void bootstrap();
