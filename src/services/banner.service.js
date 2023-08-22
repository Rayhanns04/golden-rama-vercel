import axios from "axios";
import qs from "qs";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getBanner = async () => {
  const query = qs.stringify(
    {
      populate: ["banner", "banner_mobile"],
      sort: ["sort:asc"],
      filters: {
        active: {
          $eq: true,
        },
        active_from: {
          $lte: new Date().toISOString(),
        },
        active_until: {
          $gte: new Date().toISOString(),
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  try {
    const response = await axios.get(`${BASE_URL}/banners?${query}`);
    console.log(response.data.data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
