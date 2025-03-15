import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { Check } from './entities/check.entity';
import { Repository } from 'typeorm';
export declare class CheckService {
    private checkRepository;
    constructor(checkRepository: Repository<Check>);
    create(createCheckDto: CreateCheckDto): Promise<Check>;
    findAll(): Promise<Check[]>;
    findRange(skip: number, take: number): Promise<Check[]>;
    findOne(id: number): Promise<Check>;
    count(): Promise<number>;
    update(id: number, updateCheckDto: UpdateCheckDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
