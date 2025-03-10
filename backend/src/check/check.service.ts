import { Injectable } from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>
  ) {}

  create(createCheckDto: CreateCheckDto) {
    const check = new Check();
    check.user = { id: createCheckDto.user_id } as User;

    return this.checkRepository.save(check);
  }

  findAll() {
    return this.checkRepository.find();
  }

  findOne(id: number) {
    return this.checkRepository.findOneBy({ id });
  }

  update(id: number, updateCheckDto: UpdateCheckDto) {
    return this.checkRepository.update(id, updateCheckDto);
  }

  remove(id: number) {
    return this.checkRepository.delete(id);
  }
}
