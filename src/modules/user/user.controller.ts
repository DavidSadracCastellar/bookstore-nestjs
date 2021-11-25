import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get(':id')
    //@Roles(RoleType.ADMINISTRATOR, RoleType.GENERAL)
    //@UseGuards(AuthGuard(), RoleGuard)
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
        const user = await this._userService.get(id);
        return user;
    }

    //@UseGuards(AuthGuard())
    @Get()
    getUsers(): Promise<ReadUserDto[]> {
        const users = this._userService.getAll();
        return users;
    }

    @Patch(':userId')
    updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() user: UpdateUserDto): Promise<ReadUserDto> {
        return this._userService.update(userId, user);
    }

    @Delete(':userId')
    deleteUser(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
        return this._userService.delete(userId);
    }

    @Post('setRole/:userId/:roleId')
    async setRoleToUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number,
    ): Promise<boolean> {
        return this._userService.setRoleToUser(userId, roleId);
        
    }
}
