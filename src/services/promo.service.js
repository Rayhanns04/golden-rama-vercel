import axios from "axios";
import { convertDate } from "../helpers";
const qs = require("qs");
import _ from "underscore";
import { store } from "../state";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getPromoListUsingPage = async (page, is_specific, sorting) => {
  const { promo_category, service_category, sort } = sorting;
  let categoryDiscount;
  let specific_promo = {
    active: true,
    isSpecific: is_specific,
  };
  if (sorting) {
    if (promo_category.length == 0 && service_category.length > 0) {
      categoryDiscount = {
        product_category: {
          id: {
            $in: service_category,
          },
        },
      };
    } else if (promo_category.length > 0 && service_category.length == 0) {
      categoryDiscount = {
        product_category: {
          discounts: {
            code: {
              $in: promo_category,
            },
          },
        },
      };
    } else if (promo_category.length > 0 && service_category.length > 0) {
      categoryDiscount = {
        product_category: {
          id: {
            $in: service_category,
          },
          discounts: {
            code: {
              $in: promo_category,
            },
          },
        },
      };
    }
  }

  // const query = qs.stringify(
  //   {
  //     populate: ["banner", "product_category"],
  //     filters: {
  //       ...specific_promo,
  //       ...categoryDiscount,
  //       isDisplay: { $eq: true },
  //     },
  //     pagination: {
  //       pageSize: 3,
  //       page: page,
  //     },
  //     sort: [`duration:${sort ? sort : `DESC`}`],
  //   },
  //   { encodeValuesOnly: true }
  // );
  const query = qs.stringify({
    ...specific_promo,
  });

  try {
    const response = await axios.get(
      `${BASE_URL}/promos/getListPromo?${query}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPromoListV2 = async function () {
  try {
    const response = await axios.get(`${BASE_URL}/promos/getListPromo`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPromoDetailPage = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/promos/${id}?populate[0]=banner`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPromoPayment = async (category = null) => {
  try {
    //set qs dimana start date <= now <= end date
    let PromoRule = {
      promo_rule: {
        value: {
          $eq: "4",
        },
      },
    };
    if (category == "tour") {
      PromoRule = {
        promo_rules: {
          value: {
            $eq: "4",
          },
        },
      };
    }
    const dateNow = new Date();
    const convertDateNow = convertDate(dateNow);
    const queryCategory = qs.stringify(
      {
        filters: {
          active: {
            $eq: true,
          },
          ...PromoRule,
          start_date: {
            $lte: convertDateNow,
          },
          end_date: {
            $gte: convertDateNow,
          },
        },
        sort: {
          duration: "ASC",
        },
      },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    const query = qs.stringify(
      {
        filters: {
          active: {
            $eq: true,
          },
          promo_rule: {
            value: {
              $eq: "4",
            },
          },
          start_date: {
            $lte: convertDateNow,
          },
          end_date: {
            $gte: convertDateNow,
          },
        },
        sort: {
          duration: "ASC",
        },
      },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    let response = [];
    if (category) {
      const cateogry = await axios.get(
        `${BASE_URL}/promo-${category}s${queryCategory}&populate=deep`
      );
      response = cateogry.data.data;
    }
    const global = await axios.get(`${BASE_URL}/promos${query}&populate=deep`);
    response = [...response, ...global.data.data];
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPromoList = async (isDisplay = true) => {
  const qs = require("qs");
  try {
    const dateNow = new Date();
    const convertDateNow = convertDate(dateNow);
    const query = qs.stringify(
      {
        filters: {
          active: {
            $eq: true,
          },
          is_specific: {
            $eq: true,
          },
          end_date: {
            $gte: convertDateNow,
          },
          ...(isDisplay
            ? ""
            : {
                isDisplay: { $eq: false },
              }),
        },
        sort: {
          duration: "ASC",
        },
        populate: ["banner", "product_category"],
      },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );

    const response = await axios.get(`${BASE_URL}/promos?${query}`);

    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const checkPromo = async (data, jwt) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/promos/checkPromo`,
      {
        form: data,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPromoByCode = async (promoCode, category = null) => {
  try {
    const dateNow = new Date();
    const convertDateNow = convertDate(dateNow);
    const query = qs.stringify(
      {
        filters: {
          active: {
            $eq: true,
          },
          start_date: {
            $lte: convertDateNow,
          },
          end_date: {
            $gte: convertDateNow,
          },
          code: {
            $eq: promoCode,
          },
        },
        sort: {
          duration: "ASC",
        },
      },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    const categoryRes = await axios.get(
      `${BASE_URL}/promo-${category}s${query}&populate=deep`
    );
    if (categoryRes.data.data.length == 0) {
      const global = await axios.get(
        `${BASE_URL}/promos${query}&populate=deep`
      );
      return Promise.resolve(
        global.data.data[0].attributes.payment_merchant.data
      );
    }
    return Promise.resolve(
      categoryRes.data.data[0].attributes.payment_merchant.data
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPromoListTour = async () => {
  const dateNow = new Date();
  try {
    const response = await axios.get(
      `${BASE_URL}/promo-tours?filters[isDownPayment][$eq]=true&filters[active][$eq]=true&sort[duration]=ASC&populate[0]=banner&filters[end_date][$gte]=${convertDate(
        dateNow
      )}`,
      {
        headers: {
          Authorization: `Bearer ${store.getState().authReducer.jwt}`,
        },
      }
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getArticlePromos = async ({ pageParam }) => {
  try {
    let url = `${BASE_URL}/articles?populate=*&sort=createdAt:DESC&filters[type][$eq]=promo&`;

    if (pageParam)
      url += `pagination[pageSize]=5&pagination[page]=${pageParam}&`;

    const response = await axios.get(url);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getArticlePromoDetail = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/articles/${id}?populate=*`);
    return Promise.resolve(response.data.data.attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLatestArticlePromoDetail = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/articles?filters[type][$eq]=promo&sort=createdAt:DESC&populate=*`
    );
    return Promise.resolve(response.data.data[0].attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getArticlePromoDetailBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/articles?filters[slug][$eq]=${slug}&populate=*`
    );
    if (!response.data.data || response.data.data.length === 0)
      return Promise.reject({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    return Promise.resolve(response.data.data[0].attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllPromoList = async (category = null, isDisplay = true) => {
  try {
    const query = qs.stringify(
      {
        ...(category == null
          ? ""
          : {
            category: category,
          }),
        },
        { encodeValuesOnly: true, addQueryPrefix: true }
        );
    const response = await axios.get(`${BASE_URL}/promos/getAllPromo${query}`, {
      headers: { Authorization: `Bearer ${store.getState().authReducer.jwt}` },
    });
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const postPromoUniqueCode = async (values) => {
  try {
    const response = await axios.post(`${BASE_URL}/promos/getPromoUniquecode`, {
      data: values,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
