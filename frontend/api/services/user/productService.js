import client from "../../axios/client.js";
import { userEndpoints } from "../../endpoints/user.js";

const { products: e } = userEndpoints;

/**
 * @param {Object} params - { product?, category?, keyword?, sort? } — product = schema field for classification (Hijabs, Accessories, etc.)
 */
export const productService = {
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.product && params.product !== "All")
      searchParams.append("product", params.product);
    if (params.category && params.category !== "All")
      searchParams.append("category", params.category);
    if (params.keyword) searchParams.append("keyword", params.keyword);
    if (params.sort) searchParams.append("sort", params.sort);
    const query = searchParams.toString();
    const url = query ? `${e.base}?${query}` : e.base;
    return client.get(url).then((res) => res.data);
  },

  getFeatured: () =>
    client.get(e.featured).then((res) => res.data),

  getById: (id) =>
    client.get(e.byId(id)).then((res) => res.data),
};

export default productService;
