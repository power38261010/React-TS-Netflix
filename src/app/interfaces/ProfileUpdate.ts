export interface ProfileUpdate {
  id: number;
  username?: string;
  passwordHash?: any;
  passwordHashNew?: any;
  email?: string;
}