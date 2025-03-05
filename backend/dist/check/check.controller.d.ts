import { CheckService } from './check.service';
import { UpdateCheckDto } from './dto/update-check.dto';
import { UserService } from 'src/user/user.service';
export declare class CheckController {
    private readonly checkService;
    private readonly userService;
    constructor(checkService: CheckService, userService: UserService);
    create(body: {
        user_id?: number;
        hex_uid?: string;
        date_time?: Date;
    }): Promise<import("./entities/check.entity").Check>;
    findAll(): Promise<import("./entities/check.entity").Check[]>;
    findOne(id: string): Promise<import("./entities/check.entity").Check>;
    update(id: string, updateCheckDto: UpdateCheckDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
