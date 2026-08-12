import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getAllOrdersAdmin = async () => {
  const response = await api.get('/orders/admin/all');
  return response.data;
};

export const updateOrderStatusAdmin = async (id, status) => {
  const response = await api.put(`/orders/admin/${id}/status`, { status });
  return response.data;
};
