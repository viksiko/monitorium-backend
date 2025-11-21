import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

export class TransformedData<T> {
    success: boolean;
    data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Observable<TransformedData<any>> {
        const statusCode = context
            .switchToHttp()
            .getResponse<Response>().statusCode;
        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode,
                data,
            })),
        );
    }
}
