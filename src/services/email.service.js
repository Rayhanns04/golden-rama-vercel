import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const subscribe = async (value) => {
  try {
    const response = await axios.post(`${BASE_URL}/subscribers`, {
      data: value,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
