import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as winston from 'winston';

const logDir = 'logs';

// Создаем форматтер для логов
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
);

// Создаем логгер
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'monitorium-backend' },
    transports: [
        // Логи ошибок в отдельный файл
        new winston.transports.Console({
            level: 'error',
        }),
        // Все логи в общий файл
        new winston.transports.Console({
            level: 'info',
        }),
    ],
});

// // В development режиме также выводим в консоль
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.combine(
//                 winston.format.colorize(),
//                 winston.format.simple(),
//             ),
//         }),
//     );
// }

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        logger.info(`${req.method} ${req.path}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        });
        next();
    }
}
