import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/auth/guards/access.guard';
import { User, UserResponse } from '@src/types/user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getAllUsers(): Promise<UserResponse[]> {
        return this.userService.getAllUsers();
    }

    @Get('search-users')
    @UseGuards(AuthGuard)
    async findUsersByUserName(@Query('id') id: string): Promise<User | null> {
        return this.userService.findUserById(id);
    }
}
