import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { EventEntity } from '../../event/entities/event.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  email: string;

  @OneToMany(() => EventEntity, (event) => event.user)
  events: EventEntity[];
}

export interface IConsent {
  id: 'email_notifications' | 'sms_notifications';
  enabled: boolean;
}

export interface IUserResponse {
  id: string;
  email: string;
  consents?: IConsent[]; // The EventsToConsentInterceptor guarantees consents is defined
}
