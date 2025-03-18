import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
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

      const checkWithUser = await this.checkService.findOne(check.id);

      return {
        success: true,
        message: "Check created successfully",
        data: checkWithUser
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
    const checks = await this.checkService.findAll();

    return {
      success: true,
      message: "Checks found successfully",
      data: checks
    };
  }
  
  @Get('range')
  async findRange(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('order') order: "ASC" | "DESC"
  ) {
    const checks = await this.checkService.findRange(skip, take, order);
    const count = await this.checkService.count();

    return {
      success: true,
      message: "Checks found successfully",
      data: {
        list: checks,
        count
      }
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const check = await this.checkService.findOne(+id);

    if (check) {
      return {
        success: true,
        message: "Check found successfully",
        data: check
      };
    } else {
      throw new BadRequestException("Check not found");
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    const check = await this.checkService.update(+id, updateCheckDto);

    return {
      success: true,
      message: "Check updated successfully",
      data: check
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const check = await this.checkService.remove(+id);

    return {
      success: true,
      message: "Check deleted successfully",
      data: check
    };
  }
}
