import axios from "axios";
import { getToursV2 } from "./tour.service";
import qs from "qs";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getCountries = async (search, config) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/countries?_q=${search}&sort[1]=name${
        config?.withRequirement
          ? "&populate[0]=requirement&filters[requirement][id][$notNull]=true"
          : ""
      }`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPopularCountries = async (search, config = null) => {
  try {
    const query = qs.stringify(
      search && {
        _q: search,
      },
      { encodeValuesOnly: true }
    );
    const response = await axios.get(
      `${BASE_URL}/countries?sort[1]=name&filters[isPopular][$eq]=true${
        config?.withRequirement
          ? "&populate[0]=requirement&filters[requirement][id][$notNull]=true"
          : ""
      }&${query}`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getCountriesWithTourAvailability = async (search) => {
  try {
    const response = await getCountries(search);
    // const value = await Promise.all(
    //   response.map(async (item) => {
    //     const filter = {
    //       countryCodeIn: item.attributes.isoCode2,
    //     };
    //     return Promise.resolve(
    //       (item.attributes.tourAvailability = await getToursV2(filter))
    //     );
    //   })
    // );
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getCountriesFromIsoCode = async (isoCode = null) => {
  try {
    if (isoCode && isoCode.length !== 0) {
      const qs = require("qs");
      const query = qs.stringify(
        {
          filters: {
            isoCode2: {
              $eq: isoCode,
            },
          },
          populate: "*",
        },
        {
          encodeValuesOnly: true, // prettify URL
        }
      );

      const response = await axios.get(`${BASE_URL}/countries?${query}`);
      return Promise.resolve(response.data.data);
    } else {
      return Promise.resolve({});
    }
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
