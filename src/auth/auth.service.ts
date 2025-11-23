import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        // Проверка на существующего пользователя
        const existing = await this.prismaService.user.findUnique({
            where: { email: dto.email },
        });

        if (existing) {
            throw new ConflictException(
                'Пользователь с таким email уже существует',
            );
        }

        // Используем bcryptjs для хэширования паролей
        const hashed = await bcrypt.hash(dto.password, 10);

        // Создание пользователя
        try {
            return await this.prismaService.user.create({
                data: {
                    ...dto,
                    password: hashed,
                },
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(
                'Ошибка при создании пользователя',
            );
        }
    }

    async login(loginDto: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            where: { email: loginDto.email },
        });

        const userPassword = user ? user.password : null;

        const isPasswordValid =
            userPassword &&
            (await bcrypt.compare(loginDto.password, userPassword));

        // Если пользователя нет или пароль неверный
        if (!user || !isPasswordValid) {
            throw new ConflictException('Неверный email или пароль');
        }

        const accessToken = this.jwtService.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        const refreshToken = await this.getRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
        };
    }

    private getRefreshToken = async (userId: string) => {
        // текущая дата
        const now = new Date();

        // дата + 1 месяц
        const expDate = new Date();
        expDate.setMonth(now.getMonth() + 1);

        return await this.prismaService.token.create({
            data: {
                token: v4(),
                exp: expDate,
                userId,
            },
        });
    };
}
