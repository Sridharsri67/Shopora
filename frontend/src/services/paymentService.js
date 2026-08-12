import api from './api';

export const createCheckoutSession = async (orderId) => {
  const response = await api.post('/payments/create-checkout', { orderId });
  return response.data;
};

export const simulatePaymentSuccess = async (orderId) => {
  const response = await api.post(`/payments/simulate-success/${orderId}`);
  return response.data;
};
