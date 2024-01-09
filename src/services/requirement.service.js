import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getRequirementByCountryCode = async (countryCode) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/requirements?populate=country&filters[country][isoCode2][$eq]=${countryCode}`
    );
    return Promise.resolve(response.data.data[0]);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
