// --- Системные ошибки (500 Internal Server Error) ---
export const DB_OPERATION_FAILED =
    'Не удалось выполнить операцию с базой данных. Повторите попытку позже.';

// --- Ошибки логики и аутентификации (4xx) ---
/** Сообщение для ConflictException (409), когда ресурс уже существует */
export const USER_ALREADY_EXISTS =
    'Пользователь с таким именем или email уже зарегистрирован.';

/** Сообщение для Conflict/UnauthorizedException (409/401) при неверном логине */
export const INVALID_CREDENTIALS_MSG = 'Неверный email или пароль.';

/** Сообщение для UnauthorizedException (401), когда refresh токен не прошел проверку */
export const REFRESH_TOKEN_INVALID =
    'Токен обновления недействителен или срок его действия истек.';
