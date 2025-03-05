import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      hex_uid: createUserDto.hex_uid,
    });
    if (existingUser) {
      throw new Error(`User with hex_uid ${createUserDto.hex_uid} already exists`);
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByHexUID(hex_uid: string) {
    return this.userRepository.findOneBy({ hex_uid })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
