import http from "../http-common";

const getAll = (params) => {
  return http.get("/orders", { params });
};

const OrderService = {
  getAll,
};

export default OrderService;
