import axios from "axios";
const qs = require("qs");
import _ from "underscore";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getExhibitions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/exhibitions`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// POST api order-prebooks/booking
export const postPrebooking = async (form) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/order-prebooks/booking`,
      form
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// POST order-prebooks/order-detail
export const getOrderDetail = async (orderNumber) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/order-prebooks/order-detail`,
      { orderNumber }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// POST /order-prebooks/resend-email
export const resendEmail = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/order-prebooks/resend-email`,
      payload
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getPrebooking = async (slug) => {
  try {
    const response = await axios.post(`${BASE_URL}/prebookings/get-data`, {
      slug,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// get all prebooking
export const getAllPrebooking = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/prebookings`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
