import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '@src/types/auth';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(config: ConfigService) {
        const secret = config.get<string>('JWT_ACCESS_SECRET');
        if (!secret) {
            throw new Error(
                'JWT_ACCESS_SECRET is not defined in configuration',
            );
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return payload; // попадёт в req.user
    }
}
