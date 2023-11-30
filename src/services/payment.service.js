import axios from "axios";
import { encryptData } from "../helpers/crypto";
import { store } from "../state";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getPaymentMethods = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/payment-merchants?filters[active]=true&populate[0]=logo`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPaymentGatewayByOrderId = async (orderId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/payment-gateways?filters[orderId][$eq]=${orderId}&filters[identifier][$eq]=GR`
    );
    return Promise.resolve(response.data.data[0]);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const generateVirtualAccount = async (data, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payment-gateway/va/create`,
      {
        data: data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const generateCreditCard = async (data, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payment-gateway/cc/generate`,
      {
        data: data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const checkStatus = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payment-gateway/status`,
      {
        data: {
          order_id: data.orderNumber,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${store.getState().authReducer.jwt}`,
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    // console.error(error.response);
    // return Promise.reject(error);
    return false;
  }
};

export const cancelStatus = async (data) => {
  try {
    const encryptedData = encryptData(JSON.stringify(data));
    const response = await axios.post(
      `${BASE_URL}/payment-gateway/cancel-status`,
      encryptedData,
      {
        headers: {
          Authorization: `Bearer ${store.getState().authReducer.jwt}`,
          "Content-Type": "text/plain",
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const paymentTravelCard = async (data, jwt) => {
  try {
    const payload = {
      ...data,
      cardNumber: data.cardNumber,
      pinCode: data.pinCode,
      order_id: data.order_id,
    };
    const response = await axios.post(
      `${BASE_URL}/payment-gateway/redeem`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};
