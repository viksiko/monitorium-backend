import type { ChangePasswordInput, LoginInput, RegisterInput } from './auth.schema';
import { changePasswordSchema, loginSchema, oauthSchema, registerSchema, updateProfileSchema } from "./auth.schema";

export { changePasswordSchema, loginSchema, oauthSchema, registerSchema, updateProfileSchema };
export type { ChangePasswordInput, LoginInput, RegisterInput };

