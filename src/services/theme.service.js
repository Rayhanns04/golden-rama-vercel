import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getTheme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/theme?populate=*`);
    return Promise.resolve(response.data.data.attributes);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
