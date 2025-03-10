import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User[];
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User;
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
