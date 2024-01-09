import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getDiscounts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/discounts`);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
