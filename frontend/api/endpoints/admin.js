/**
 * API endpoints used by admin flows. Matches backend routes and schema.
 */
const users = {
  base: "/admin/users",
  byId: (id) => `/admin/users/${id}`,
  orders: (id) => `/admin/users/${id}/orders`,
  block: (id) => `/admin/users/${id}/block`,
};

const products = {
  base: "/admin/products",
  byId: (id) => `/admin/products/${id}`,
  pricing: (id) => `/admin/products/${id}/pricing`,
  stock: (id) => `/admin/products/${id}/stock`,
  variant: (id) => `/admin/products/${id}/variant`,
  bulkUpdate: "/admin/products/bulk-update",
};

const orders = {
  base: "/admin/orders",
  stats: "/orders/stats",
  byId: (id) => `/admin/orders/${id}`,
  status: (id) => `/admin/orders/${id}/status`,
  bulkStatus: "/admin/orders/bulk-update",
  deliveryDate: (id) => `/admin/orders/${id}/delivery-date`,
  return: (id) => `/admin/orders/${id}/return`,
};

const wallet = {
  refund: "/admin/wallet/refund",
  byUserId: (userId) => `/admin/wallet/${userId}`,
  transactions: (userId) => `/admin/wallet/${userId}/transactions`,
};

const brands = {
  base: "/admin/brands",
  byId: (id) => `/admin/brands/${id}`,
};

const categories = {
  base: "/admin/categories",
  byId: (id) => `/admin/categories/${id}`,
};

export const adminEndpoints = { users, products, orders, wallet, brands, categories };
