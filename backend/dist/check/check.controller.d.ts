import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
export declare class CheckController {
    private readonly checkService;
    constructor(checkService: CheckService);
    create(createCheckDto: CreateCheckDto): Promise<import("./entities/check.entity").Check>;
    findAll(): Promise<import("./entities/check.entity").Check[]>;
    findOne(id: string): Promise<import("./entities/check.entity").Check>;
    update(id: string, updateCheckDto: UpdateCheckDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
