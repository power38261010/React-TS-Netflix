export interface PaymentRequest {
  amount: number;
  token: string;
  payerEmail: string;
  description: string;
  paymentMethodId: string;
  isAnual: boolean;
  payId: number| null;
}

export interface PaymentResponse {
  id: any | undefined;
  amount: number;
  token: string;
  payerEmail: string;
  description: string;
  paymentMethodId: string;
}

export interface PaySubscription {
  id: any | undefined;
  isAnual: boolean;
  payerEmail: string;
  token: string;
  description: string;
  status: string;
  paidDate: Date;
  amount: number;
  payId: number| null;
  userId: number| null;
}