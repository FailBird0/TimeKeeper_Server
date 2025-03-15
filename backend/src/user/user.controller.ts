import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      return {
        success: true,
        message: "User created successfully",
        data: user
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return {
      success: true,
      message: "Users found successfully",
      data: users
    };
  }

  @Get('range')
  async findRange(
    @Query('skip') skip: number,
    @Query('take') take: number
  ) {
    const users = await this.userService.findRange(skip, take);
    const count = await this.userService.count();

    return {
      success: true,
      message: "Users found successfully",
      data: {
        users,
        count
      }
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);

    if (user) {
      return {
        success: true,
        message: "User found successfully",
        data: user
      };
    } else {
      throw new BadRequestException("User not found");
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);

    return {
      success: true,
      message: "User updated successfully",
      data: user
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(+id);

    return {
      success: true,
      message: "User deleted successfully",
      data: user
    };
  }
}
