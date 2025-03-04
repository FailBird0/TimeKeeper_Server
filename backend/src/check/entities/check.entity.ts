import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Check {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.checks)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
  date_time: Date;
}
