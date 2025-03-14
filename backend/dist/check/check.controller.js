"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckController = void 0;
const common_1 = require("@nestjs/common");
const check_service_1 = require("./check.service");
const create_check_dto_1 = require("./dto/create-check.dto");
const update_check_dto_1 = require("./dto/update-check.dto");
const user_service_1 = require("../user/user.service");
let CheckController = class CheckController {
    constructor(checkService, userService) {
        this.checkService = checkService;
        this.userService = userService;
    }
    async create(body) {
        if (!body.user_id && !body.hex_uid) {
            throw new common_1.BadRequestException("Either user_id or hex_uid must be provided");
        }
        if (!body.user_id && body.hex_uid) {
            const user = await this.userService.findOneByHexUID(body.hex_uid);
            if (!user) {
                throw new common_1.BadRequestException("User not found for the provided hex_uid");
            }
            body.user_id = user.id;
        }
        const createCheckDto = new create_check_dto_1.CreateCheckDto();
        createCheckDto.user_id = body.user_id;
        createCheckDto.date_time = body.date_time;
        try {
            const check = await this.checkService.create(createCheckDto);
            const checkWithUser = await this.checkService.findOne(check.id);
            return {
                success: true,
                message: "Check created successfully",
                data: checkWithUser
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    async findAll() {
        const checks = await this.checkService.findAll();
        return {
            success: true,
            message: "Checks found successfully",
            data: checks
        };
    }
    async findRange(skip, take) {
        const checks = await this.checkService.findRange(skip, take);
        return {
            success: true,
            message: "Checks found successfully",
            data: checks
        };
    }
    async findOne(id) {
        const check = await this.checkService.findOne(+id);
        if (check) {
            return {
                success: true,
                message: "Check found successfully",
                data: check
            };
        }
        else {
            throw new common_1.BadRequestException("Check not found");
        }
    }
    async update(id, updateCheckDto) {
        const check = await this.checkService.update(+id, updateCheckDto);
        return {
            success: true,
            message: "Check updated successfully",
            data: check
        };
    }
    async remove(id) {
        const check = await this.checkService.remove(+id);
        return {
            success: true,
            message: "Check deleted successfully",
            data: check
        };
    }
};
exports.CheckController = CheckController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CheckController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('range'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CheckController.prototype, "findRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CheckController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_check_dto_1.UpdateCheckDto]),
    __metadata("design:returntype", Promise)
], CheckController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CheckController.prototype, "remove", null);
exports.CheckController = CheckController = __decorate([
    (0, common_1.Controller)('check'),
    __metadata("design:paramtypes", [check_service_1.CheckService, user_service_1.UserService])
], CheckController);
//# sourceMappingURL=check.controller.js.map