import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Event } from '../../event/entities/event.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @ManyToOne(() => Event, (event) => event.user)
  events: Event[];
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
