import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
    imports: [
        JwtModule.register({}), // конфиг через sign()
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, AccessStrategy, RefreshStrategy],
    exports: [JwtModule],
})
export class AuthModule {}
