import { User } from '../entities/user.entity';

const mockUser = new User();
mockUser.id = 'ed206598-947d-4625-8deb-a8d3de594c18';
mockUser.email = 'user@provider.com';
mockUser.events = undefined;
mockUser.active = true;

export const mockUsers: User[] = [mockUser];
