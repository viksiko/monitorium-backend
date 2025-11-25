import { Role as PrismaRole } from '@prisma/client';

export { Role } from '@prisma/client';

export interface User {
    id: string;
    email: string;
    phone: string | null;
    gosuslugiId: string | null;
    sberId: string | null;
    tinkoffId: string | null;
    password: string | null;
    name: string | null;
    district: string | null;
    verified: boolean;
    isRepresentative: boolean;
    role: PrismaRole;
    position: string | null;
    party: string | null;
    rating: number | null;
    tasksTotal: number;
    tasksCompleted: number;
    attendance: number | null;
    lastActivity: Date | null;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

// export interface UserResponse {
//     id: string;
//     name: string | null;
//     email: string;
//     role: PrismaRole;
// }

export type UserResponse = Pick<User, 'id' | 'name' | 'email' | 'role'>;
