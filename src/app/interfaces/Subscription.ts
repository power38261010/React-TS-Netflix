import { MovieSubscriptionDto } from "./MovieSubscription";

export interface Subscription {
  id: number;
  type?: string;
  movieSubscriptions?: MovieSubscriptionDto[];

}