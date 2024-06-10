export interface User {
  id: number;
  username: string;
  role?: string;
  expirationDate?: Date;
  isPaid?: boolean;
  subscription?: SubscriptionDTO;
}

interface SubscriptionDTO {
  id: number;
  Type?: string;
}