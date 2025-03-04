import { Check } from "src/check/entities/check.entity";
export declare class User {
    id: number;
    hex_uid: string;
    name: string;
    checks: Check[];
}
