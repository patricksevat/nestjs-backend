import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
@Index(['user', 'active']) // TODO don't know if this will work
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  active: boolean;

  @Column()
  email: boolean;

  @Column()
  sms: boolean;

  @Column('timestamp')
  timestamp: string;

  @ManyToOne(() => User, (user) => user.events)
  user: User;
}
