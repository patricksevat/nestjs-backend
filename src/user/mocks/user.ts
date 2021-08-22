import { User } from '../entities/user.entity';

export const mockUserWithoutEvents = new User();
mockUserWithoutEvents.id = 'ed206598-947d-4625-8deb-a8d3de594c18';
mockUserWithoutEvents.email = 'user@provider.com';
mockUserWithoutEvents.events = undefined;
mockUserWithoutEvents.active = true;

export const mockUsers: User[] = [mockUserWithoutEvents];
