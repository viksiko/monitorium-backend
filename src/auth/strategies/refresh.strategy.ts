import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '@src/types/auth';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        const secretOrKey = config.get<string>('JWT_REFRESH_SECRET');
        if (!secretOrKey) {
            throw new Error('JWT_REFRESH_SECRET is not set');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secretOrKey,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return payload;
    }
}
