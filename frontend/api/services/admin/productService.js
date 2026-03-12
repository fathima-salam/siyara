import client from "../../axios/client.js";
import { adminEndpoints } from "../../endpoints/admin.js";

const { products: e } = adminEndpoints;

export const adminProductService = {
  getProducts: () =>
    client.get(e.base).then((res) => res.data),

  getById: (id) =>
    client.get(e.byId(id)).then((res) => res.data),

  create: (data) =>
    client.post(e.base, data).then((res) => res.data),

  update: (id, data) =>
    client.put(e.byId(id), data).then((res) => res.data),

  updatePricing: (id, data) =>
    client.patch(e.pricing(id), data).then((res) => res.data),

  updateStock: (id, data) =>
    client.patch(e.stock(id), data).then((res) => res.data),

  updateVariant: (id, data) =>
    client.patch(e.variant(id), data).then((res) => res.data),

  bulkUpdate: (data) =>
    client.patch(e.bulkUpdate, data).then((res) => res.data),

  uploadImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return client
      .post("/admin/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  delete: (id) =>
    client.delete(e.byId(id)).then((res) => res.data),
};

export default adminProductService;
