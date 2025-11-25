import * as crypto from 'crypto';
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
    DB_OPERATION_FAILED,
    INVALID_CREDENTIALS_MSG,
    REFRESH_TOKEN_INVALID,
    USER_ALREADY_EXISTS,
} from '@src/constants/errors.constants';
import { JwtPayload } from '@src/types/auth';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private configService: ConfigService,
    ) {}

    // Регистрация
    async register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            const existing = await this.prisma.user.findUnique({
                where: { email: registerDto.email },
            });

            if (existing) {
                throw new ConflictException(USER_ALREADY_EXISTS);
            }

            // Используем bcryptjs для хэширования паролей
            const hashed = await bcrypt.hash(registerDto.password, 10);

            const user = await this.prisma.user.create({
                data: { ...registerDto, password: hashed },
            });

            // Надо будет переделать. При регистрации сразу не должны создаваться токены
            return this.generateTokens({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Авторизация
    async login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
            });

            if (!user) {
                throw new ConflictException(INVALID_CREDENTIALS_MSG);
            }

            // Проверка пароля
            const isPasswordValid = await bcrypt.compare(
                loginDto.password,
                user.password as string,
            );

            if (!isPasswordValid) {
                throw new ConflictException(INVALID_CREDENTIALS_MSG);
            }

            // Успешный вход
            return this.generateTokens({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Выход из системы
    async logout(LogoutDto: string): Promise<{
        success: boolean;
    }> {
        const hashed = this.hashToken(LogoutDto);

        try {
            await this.prisma.token.deleteMany({
                where: { hashedToken: hashed },
            });

            return { success: true };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Refresh токен
    async refresh(
        refreshDto: RefreshDto,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            // Получаем payload из токена
            const verifyJwt = this.jwt.verify(refreshDto.refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const hashed = this.hashToken(refreshDto.refreshToken);

            const tokenRecord = await this.prisma.token.findUnique({
                where: { hashedToken: hashed },
            });

            // Удаляем старый refresh-токен если он существует
            if (tokenRecord) {
                await this.prisma.token.delete({
                    where: { id: tokenRecord.id },
                });
            }

            // Генерируем новую пару токенов
            return await this.generateTokens({
                id: verifyJwt.id,
                name: verifyJwt.name,
                email: verifyJwt.email,
                role: verifyJwt.role,
            });
        } catch (error) {
            // Проверка на ошибки JWT (TokenExpiredError, JsonWebTokenError и т.д.)
            // Эти ошибки возникают при невалидности токена, это ошибка клиента (401)
            if (
                error.name === 'TokenExpiredError' ||
                error.name === 'JsonWebTokenError'
            ) {
                throw new UnauthorizedException(REFRESH_TOKEN_INVALID);
            }

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }
    // Генерация токенов
    private async generateTokens(
        payload: JwtPayload,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = this.jwt.sign<JwtPayload>(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
        });

        const refreshToken = this.jwt.sign<JwtPayload>(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
        });

        const decodedToken = this.jwt.decode(refreshToken);

        // Преобразует время истечения срока действия токена
        const expiresAt = new Date(decodedToken.exp * 1000);

        await this.saveRefreshToken(payload.id, refreshToken, expiresAt);

        return { accessToken, refreshToken };
    }

    // Сохранение токена в базу
    private async saveRefreshToken(
        userId: string,
        refreshToken: string,
        expiresAt: Date,
    ): Promise<void> {
        const hashed = this.hashToken(refreshToken);

        try {
            await this.prisma.token.create({
                data: {
                    hashedToken: hashed,
                    userId,
                    exp: expiresAt,
                },
            });
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error(
                `Не удалось сохранить токен для пользователя ${userId}:`,
                error,
            );

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    private hashToken(token: string): string {
        return crypto
            .createHmac(
                'sha256',
                this.configService.get('JWT_REFRESH_TOKEN_SALT') || '',
            )
            .update(token)
            .digest('hex');
    }
}
