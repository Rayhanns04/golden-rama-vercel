import axios from "axios";
import _ from "lodash";
import { filter } from "underscore";
import { convertCurrencySGDtoIDR, percentage } from "../helpers";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getAllAttractions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/attractions`);
    return Promise.resolve(response.data.results);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getAttractions = async ({
  queryFilter,
  search,
  pageParam = 1,
  pageSize = 9,
}) => {
  try {
    let filters = {
      // basePrice default gte
      $and: [
        {
          basePrice: {
            $lte: 1000000000,
          },
        },
        {
          basePrice: {
            $gte: 1,
          },
        },
      ],
    };
    if (queryFilter) {
      if (queryFilter.max_price && queryFilter.min_price) {
        // filters.categories = { uuid: { $eq: queryFilter.categories } };
        const max_price = await convertCurrencySGDtoIDR(queryFilter.max_price);
        const min_price = await convertCurrencySGDtoIDR(queryFilter.min_price);
        filters.$and = [
          {
            basePrice: {
              $lte: max_price,
            },
          },
          {
            basePrice: {
              $gte: min_price == 0 ? 1 : min_price,
            },
          },
        ];
      }
      if (queryFilter.categories && queryFilter.categories !== "") {
        filters.categories = { uuid: { $eq: queryFilter.categories } };
      }
      if (queryFilter.type && queryFilter.type !== "") {
        filters.typeUuid = { $eq: queryFilter.type };
      }
      if (queryFilter.places_type === "countryList" && queryFilter.places) {
        filters.locations = {
          state: { country: { uuid: { $eq: queryFilter.places } } },
        };
      } else if (queryFilter.places_type === "cityList" && queryFilter.places) {
        filters.locations = { uuid: { $eq: queryFilter.places } };
      }
      // }
    }
    const qs = require("qs");
    const queries = {
      filters,
      pagination: {
        pageSize: pageSize,
        page: pageParam,
      },
    };
    if (queryFilter?.sort) {
      queries.sort = { basePrice: queryFilter.sort };
    }
    if (search) {
      queries._q = search;
    }
    const query = qs.stringify(queries, {
      encodeValuesOnly: true, // prettify URL
    });

    const response = await axios.get(`${BASE_URL}/orders/attractions?${query}`);
    return Promise.resolve({ ...response.data, data: response.data.results });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
export const getAttractionsArea = async ({
  search,
  pageParam = 1,
  pageSize = 9,
}) => {
  try {
    const filters = {};
    const qs = require("qs");
    const query = qs.stringify(
      {
        query: search,
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );
    const response = await axios.get(
      `${BASE_URL}/orders/attractions/filter?${query}`
    );
    const { data } = response;
    Object.keys(data).map((list) => {
      data[list].map((item) => {
        return (item.type = list);
      });
    });
    const merged = [
      ...data.attractionList,
      ...data.countryList,
      ...data.cityList,
    ];
    const sortByMatchingScore = await _.orderBy(
      merged,
      "matchingScore",
      "desc"
    );
    return Promise.resolve(sortByMatchingScore);
  } catch (error) {
    console.error(error);

    console.error(error);
    return Promise.reject(error);
  }
};

export const getStateById = async (uuid) => {
  try {
    const array = [
      "attraction-states",
      "attraction-countries",
      "attractions",
      "attraction-cities",
    ];
    const qs = require("qs");
    const response = await Promise.all(
      array.map(async (item) => {
        const query = qs.stringify({
          filters: {
            uuid: {
              $eq: uuid,
            },
          },
        });
        const response = await axios.get(`${BASE_URL}/${item}?${query}`);
        return Promise.resolve(response.data);
      })
    );
    return Promise.resolve(
      ...response.filter((item) => {
        return item.data.length !== 0;
      })
    );
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getAttractionsCategory = async ({ page }) => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/type/attractions`);
    // return Promise.resolve(response.data.data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
export const getAttractionsGroupCategories = async ({ page }) => {
  try {
    const qs = require("qs");
    const query = qs.stringify(
      {
        populate: "*",
      },
      { encodeValuesOnly: true }
    );
    const response = await axios.get(
      `${BASE_URL}/attraction-group-categories?${query}`
    );
    // return Promise.resolve(response.data.data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getAttractionsDetailTicket = async (uuid) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/orders/attractions/type/${uuid}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getAttractionsType = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/type/attractions`);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getAttractionsDetails = async (detailsId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/orders/attractions/${detailsId}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
export const getAttractionsProductTypeDetails = async (detailsId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/orders/attractions/type/${detailsId}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
export const parsePriceAvailable = async (uuid, convertDate, ticket) => {
  try {
    const response = await getAttractionsProductTypeDetailsPriceListByDate(
      uuid,
      convertDate
    );
    let parse;
    parse = { ...response };
    parse.prices.youth =
      response.prices.youth.length > 0
        ? response.prices.youth.map((item) => {
            return item + percentage(item, ticket?.youthRecommendedMarkup);
          })
        : [];
    parse.prices.adults =
      response.prices.adults.length > 0
        ? response.prices.adults.map((item) => {
            return item + percentage(item, ticket?.adultRecommendedMarkup);
          })
        : [];
    parse.prices.children =
      response.prices.children.length > 0
        ? response.prices.children.map((item) => {
            return item + percentage(item, ticket?.childRecommendedMarkup);
          })
        : [];
    parse.prices.seniors =
      response.prices.seniors.length > 0
        ? response.prices.seniors.map((item) => {
            return item + percentage(item, ticket?.seniorRecommendedMarkup);
          })
        : [];
    parse.prices.infant =
      response.prices.infant.length > 0
        ? response.prices.infant.map((item) => {
            return item + percentage(item, ticket?.infantRecommendedMarkup);
          })
        : [];
    return Promise.resolve(parse);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
export const getAttractionsProductTypeDetailsPriceListByDate = async (
  detailsId,
  date
) => {
  try {
    const data = { date };
    const response = await axios.post(
      `${BASE_URL}/orders/attractions/type/${detailsId}/price`,
      data
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    console.error(error);
    return Promise.reject(error);
  }
};
export const getAttractionsProductTypeDetailsPriceList = async (detailsId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/orders/attractions/type/${detailsId}/price`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const bookingAttraction = async (data, token) => {
  const traveler = data.traveler.map((item) => {
    return {
      paxType: item.paxType,
      first_name: item.first_name,
      last_name: item.last_name,
      title: item.title,
      dob: item.dob,
      country: item.country,
      phone: data.customer.phone,
      phoneType: "M",
      email: data.customer.email,
      docs: {
        ...(item.publisher_country == ""
          ? {
              cardType: "IN",
              cardNum: item.passport_number,
            }
          : {
              cardType: "PP",
              cardNum: item.passport_number,
              cardIssuePlace: item.publisher_country,
              cardExpired: {
                year: new Date(item.expired_date).getFullYear(),
                month: new Date(item.expired_date).getMonth(),
                day: new Date(item.expired_date).getDay(),
              },
            }),
      },
    };
  });

  let payload = data;
  payload.traveler = traveler;
  payload = encryptData(JSON.stringify(payload));
  try {
    const response = await axios.post(
      `${BASE_URL}/orders/attractions/booking`,
      payload,
      {
        headers: {
          "Content-Type": "text/plain",
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

export const getOrderDetail = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/orders/attractions/detail`,
      data
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const analyticDetail = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/orders/attractions/analyticDetail`,
      data
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
