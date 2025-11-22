import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}
    async register(registerDto: RegisterDto) {
        // Проверка на существующего пользователя
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException(
                'Пользователь с таким email уже существует',
            );
        }

        // Используемbcryptjs для хэширования паролей
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return await this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
            },
        });
    }
}
