import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from '@shared/filter';
import { TransformInterceptor } from '@shared/interceptor';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    // Использование middleware, interceptors
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // Валидация входящих DTO
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Запуск приложения
    await app.listen(process.env.API_PORT as string);
}
bootstrap().catch((error) => {
    console.error('Error starting the application:', error);
    process.exit(1);
});
