import { api } from './api';

export interface PaymentMethods {
  payhere: boolean;
  bankTransfer: boolean;
  deliveryCod: boolean;
}

export const fetchPaymentMethods = () => api<PaymentMethods>('/api/payments/methods');

/** Terminal-good order statuses after payment. */
export const PAYMENT_SUCCESS = new Set(['PAID', 'CONFIRMED']);

/** Statuses where the customer should wait (bank review, webhook lag). */
export const PAYMENT_PENDING = new Set(['PENDING_PAYMENT', 'AWAITING_BANK_CONFIRMATION']);

export const PAYMENT_FAILED = new Set(['PAYMENT_FAILED', 'BANK_SLIP_REJECTED', 'CANCELLED']);
