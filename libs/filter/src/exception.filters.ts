import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Оригинальный ответ NestJS (может быть строкой или объектом)
        const exceptionResponse = exception.getResponse();

        /*
      Пример exceptionResponse при валидации:
      {
        statusCode: 400,
        message: [ ...errors ],
        error: "Bad Request"
      }
    */

        let message: string | string[];

        if (typeof exceptionResponse === 'string') {
            // Например, throw new HttpException("Error", 400)
            message = exceptionResponse;
        } else if (
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null
        ) {
            // Берём message, если он есть
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message = (exceptionResponse as any).message ?? exception.message;
        } else {
            // fallback
            message = exception.message;
        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message, // если массив — отдаётся массив, если строка — строка
        });
    }
}
