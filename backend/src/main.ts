import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger setup con seguridad y tags
  const options = new DocumentBuilder()
    .setTitle('Talento Activo API')
    .setDescription(`
    ## Autenticación
    - **API Key**: Header \`x-api-key\` con valor de \`API_KEY\` (ver .env)
    - **JWT**: Header \`Authorization: Bearer <token>\` (obtenido en /auth/login)
    
    ## Roles
    - \`CODER\`: ver vacantes activas, postularse
    - \`GESTOR\`: gestionar vacantes y postulaciones
    - \`ADMIN\`: acceso total
    
    ## Respuestas
    Las respuestas exitosas están envueltas en:
    \`\`\`json
    {
      "success": true,
      "data": {},
      "message": "Operación exitosa"
    }
    \`\`\`
    `)
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header', description: 'API Key para todas las peticiones' },
      'api-key',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'JWT token obtenido en /auth/login' },
      'jwt',
    )
    .addTag('auth', 'Autenticación (público)')
    .addTag('vacancies', 'Gestión de vacantes')
    .addTag('applications', 'Postulaciones')
    .addTag('users', 'Usuarios (solo admin)')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(` Swagger documentation available at: http://localhost:${port}/docs`);
}
bootstrap();
