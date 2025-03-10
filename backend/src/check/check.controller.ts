import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { UserService } from 'src/user/user.service';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService, private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: {user_id?: number, hex_uid?: string, date_time?: Date}) {
    if (!body.user_id && !body.hex_uid) {
      throw new BadRequestException("Either user_id or hex_uid must be provided");
    }

    if (!body.user_id && body.hex_uid) {
      const user = await this.userService.findOneByHexUID(body.hex_uid);

      if (!user) {
        throw new BadRequestException("User not found for the provided hex_uid")
      }

      body.user_id = user.id;
    }

    const createCheckDto = new CreateCheckDto();
    createCheckDto.user_id = body.user_id;
    createCheckDto.date_time = body.date_time;

    try {
      const check = await this.checkService.create(createCheckDto);

      return {
        success: true,
        message: "Check created successfully",
        data: check
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const checks = await this.checkService.findAll();

      return {
        success: true,
        message: "Checks found successfully",
        data: checks
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const check = await this.checkService.findOne(+id);

      return {
        success: true,
        message: "Check found successfully",
        data: check
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    try {
      const check = await this.checkService.update(+id, updateCheckDto);

      return {
        success: true,
        message: "Check updated successfully",
        data: check
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const check = await this.checkService.remove(+id);

      return {
        success: true,
        message: "Check deleted successfully",
        data: check
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
