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

    return this.checkService.create(createCheckDto);
  }

  @Get()
  findAll() {
    return this.checkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    return this.checkService.update(+id, updateCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkService.remove(+id);
  }
}
