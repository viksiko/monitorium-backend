import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/user.service';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../../src/types/expressRequest.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private jwt: JwtService,
        private configService: ConfigService,
    ) {}
    async use(
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (!req.headers.authorization) {
            req.user = undefined;

            next();
            return;
        }

        const token = req.headers.authorization.split(' ')[1];

        try {
            const verifyJwt = this.jwt.verify(token, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
            });

            const user = await this.userService.findUserById(
                verifyJwt.id as string,
            );

            req.user = user ? user : undefined;
        } finally {
            next();
        }
    }
}
