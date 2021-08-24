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
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  email_notifications: boolean;

  @Column({ default: false })
  sms_notifications: boolean;

  @Column('timestamp', { default: () => 'now()' })
  timestamp: string;

  @ManyToOne(() => User, (user) => user.events, {
    cascade: ['insert'],
  })
  user: User;

  @Column({ nullable: true })
  userId: string;
}
