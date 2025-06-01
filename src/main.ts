import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from '@shared/filter';
import { TransformInterceptor } from '@shared/interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Использование middleware
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    // Запуск приложения
    await app.listen(process.env.API_PORT as string);
}
bootstrap();
