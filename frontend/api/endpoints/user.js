/**
 * API endpoints used by customer-facing (user) flows.
 */
const users = {
  login: "/users/login",
  register: "/users",
  profile: "/users/profile",
  sendOTP: "/users/send-otp",
  verifyOTP: "/users/verify-otp",
};

const products = {
  base: "/products",
  featured: "/products/featured",
  byId: (id) => `/products/${id}`,
};

const orders = {
  base: "/orders",
  myOrders: "/orders/myorders",
  byId: (id) => `/orders/${id}`,
  pay: (id) => `/orders/${id}/pay`,
};

const stripe = {
  config: "/stripe/config",
  createPaymentIntent: "/stripe/create-payment-intent",
};

export const userEndpoints = { users, products, orders, stripe };
