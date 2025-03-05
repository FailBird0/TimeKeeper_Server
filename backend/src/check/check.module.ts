import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Check]), TypeOrmModule.forFeature([User])],
  controllers: [CheckController],
  providers: [CheckService, UserService],
  exports: [CheckService, UserService],
})
export class CheckModule {}
