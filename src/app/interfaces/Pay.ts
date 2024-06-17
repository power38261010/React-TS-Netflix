import { Subscription } from "./Subscription";

export interface Pay {
  id: number;
  currency: string;
  monthlyPayment: number;
  annualMultiplierPayment: number;
  interestMonthlyPayment: number;
  subscriptionId: number;
  subscription?: Subscription;
}