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
exports.CheckService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const check_entity_1 = require("./entities/check.entity");
const typeorm_2 = require("typeorm");
let CheckService = class CheckService {
    constructor(checkRepository) {
        this.checkRepository = checkRepository;
    }
    create(createCheckDto) {
        const check = new check_entity_1.Check();
        check.user = { id: createCheckDto.user_id };
        return this.checkRepository.save(check);
    }
    findAll() {
        return this.checkRepository.find();
    }
    findOne(id) {
        return this.checkRepository.findOne({
            where: { id },
            relations: ["user"]
        });
    }
    update(id, updateCheckDto) {
        return this.checkRepository.update(id, updateCheckDto);
    }
    remove(id) {
        return this.checkRepository.delete(id);
    }
};
exports.CheckService = CheckService;
exports.CheckService = CheckService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(check_entity_1.Check)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CheckService);
//# sourceMappingURL=check.service.js.map