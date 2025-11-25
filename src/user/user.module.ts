import { Module } from '@nestjs/common';
import { AuthGuard } from '@src/auth/guards/access.guard';
import { PrismaService } from '@src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, AuthGuard],
    exports: [UserService],
})
export class UserModule {}
