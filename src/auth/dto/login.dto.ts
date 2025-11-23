import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Некорректный email' })
    @MaxLength(50, { message: 'Email должен быть не более 50 символов' })
    @IsNotEmpty({ message: 'Email не может быть пустым' })
    email: string;

    @IsString({ message: 'Пароль должно быть строкой' })
    @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
    @MaxLength(50, { message: 'Пароль должен быть не более 50 символов' })
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ',
        },
    )
    password: string;
}
