export interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
  expirationDate?: Date;
  isPaid?: boolean;
  subscriptionId?: number;
  subscription?: SubscriptionDTO;
}

interface SubscriptionDTO {
  id: number;
  type?: string;
}