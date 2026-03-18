import client from "../../axios/client.js";
import { adminEndpoints } from "../../endpoints/admin.js";

const { orders: e } = adminEndpoints;

export const adminOrderService = {
  getAll: (params) =>
    client.get(e.base, { params }).then((res) => res.data),

  getStats: () =>
    client.get(e.stats).then((res) => res.data),

  getById: (id) =>
    client.get(e.byId(id)).then((res) => res.data),

  updateStatus: (id, status) =>
    client.patch(e.status(id), { status }).then((res) => res.data),

  bulkUpdateStatus: (orderIds, status) =>
    client.patch(e.bulkStatus, { orderIds, status }).then((res) => res.data),

  updateDeliveryDate: (id, deliveryDate) =>
    client.patch(e.deliveryDate(id), { deliveryDate }).then((res) => res.data),

  handleReturn: (id, action) =>
    client.patch(e.return(id), { action }).then((res) => res.data),
};

export default adminOrderService;
