export interface Pay {
  id: number;
  currency: string;
  monthlyPayment: number;
  annualMultiplierPayment: number;
  interestMonthlyPayment: number;
  subscriptionId?: number;
}