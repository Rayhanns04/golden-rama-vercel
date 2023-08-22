import axios from "axios";
import { store } from "../state";
import { mapDataOrderDetail } from "../helpers/mapDataOrder";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getOrderHistories = async ({ filter, sort, tab }) => {
  try {
    const filterParams = {
      $and: [
        {
          transactionDate: {
            $gte: filter[0],
            $lte: filter[1],
          },
        },
        {
          type: {
            $eq: filter.types,
          },
        },
        {
          payment_method: {
            name: {
              $eq: filter.payment_method,
            },
          },
        },
      ],
    };
    const qs = require("qs");
    const query = qs.stringify(
      {
        filters: filterParams,
        populate: "*",
        sort: `createdAt:${sort}`,
        tab,
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(`${BASE_URL}/orders/history?${query}`, {
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.jwt}`,
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/${id}`, {
      params: {
        populate: ["order_details", "payment_method", "customer"],
      },
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.jwt}`,
      },
    });
    const data = mapDataOrderDetail(response.data.data);
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getOrderByOrderNumber = async (orderNumber) => {
  try {
    console.log(orderNumber, store.getState().authReducer.jwt);
    const response = await axios.get(`${BASE_URL}/orders`, {
      params: {
        ["filters[orderNumber][$eq]"]: orderNumber,
        populate: ["order_details", "payment_method", "customer"],
      },
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.jwt}`,
      },
    });
    const data = mapDataOrderDetail(response.data.data[0]);
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const updateOrder = async ({ id, data }) => {
  try {
    const response = await axios.put(`${BASE_URL}/orders/${id}`, {
      data,
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.jwt}`,
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
