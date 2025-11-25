import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
    @IsString()
    @IsNotEmpty({ message: 'Refresh токен не должен быть пустым' })
    refreshToken: string;
}
