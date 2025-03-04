import { Check } from "src/check/entities/check.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  hex_uid: string;

  @Column()
  name: string;

  @OneToMany(() => Check, (check) => check.user)
  checks: Check[];
}
