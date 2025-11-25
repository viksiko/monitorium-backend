import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '@shared/middleware';
import { AuthMiddleware } from '../libs/middleware/src/auth.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        consumer.apply(AuthMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
