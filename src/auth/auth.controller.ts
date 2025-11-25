import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    async logout(@Body() LogoutDto: LogoutDto): Promise<{
        success: boolean;
    }> {
        return this.authService.logout(LogoutDto.refreshToken);
    }

    @Post('refresh')
    async refresh(@Body() refreshDto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return this.authService.refresh(refreshDto);
    }
}
