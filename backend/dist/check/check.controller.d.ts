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
    }): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/check.entity").Check;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/check.entity").Check[];
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/check.entity").Check;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    update(id: string, updateCheckDto: UpdateCheckDto): Promise<{
        success: boolean;
        message: string;
        data: import("typeorm").UpdateResult;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("typeorm").DeleteResult;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
