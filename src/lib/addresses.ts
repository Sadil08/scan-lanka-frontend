import { api } from './api';

export interface SavedAddress {
  id: number;
  label: string | null;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

export interface AddressInput {
  label?: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  isDefault?: boolean;
}

export const listAddresses = () => api<SavedAddress[]>('/api/addresses');

export const createAddress = (input: AddressInput) =>
  api<SavedAddress>('/api/addresses', { method: 'POST', body: JSON.stringify(input) });

export const updateAddress = (id: number, input: AddressInput) =>
  api<SavedAddress>(`/api/addresses/${id}`, { method: 'PUT', body: JSON.stringify(input) });

export const deleteAddress = (id: number) =>
  api<void>(`/api/addresses/${id}`, { method: 'DELETE' });
