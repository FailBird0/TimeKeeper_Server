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
    }>;
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User[];
    }>;
    findRange(skip: number, take: number): Promise<{
        success: boolean;
        message: string;
        data: {
            users: import("./entities/user.entity").User[];
            count: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("typeorm").DeleteResult;
    }>;
}
