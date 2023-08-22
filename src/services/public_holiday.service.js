import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getPublicHolidays = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/public-holidays`);
    const data = response.data.data.map((item) => ({ ...item.attributes }));
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
