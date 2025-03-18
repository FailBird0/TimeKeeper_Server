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
    return this.checkRepository.find({
      relations: ["user"]
    });
  }

  findRange(skip: number, take: number, order: "ASC" | "DESC") {
    return this.checkRepository.find({
      skip,
      take,
      relations: ["user"],
      order: {
        id: order
      }
    });
  }

  findOne(id: number) {
    return this.checkRepository.findOne({
      where: { id },
      relations: ["user"]
    });
  }

  count() {
    return this.checkRepository.count();
  }

  update(id: number, updateCheckDto: UpdateCheckDto) {
    return this.checkRepository.update(id, updateCheckDto);
  }

  remove(id: number) {
    return this.checkRepository.delete(id);
  }
}
