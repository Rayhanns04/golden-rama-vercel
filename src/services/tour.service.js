import axios from "axios";
import _ from "underscore";
import { getTourAirlineAvailable } from "../helpers";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getTours = async (filters, params) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/tours`, {
      data: {
        operationName: "tourAvailability",
        operationNameCustom: "tourAvailability",
        variables: filters,
        params: params,
      },
    });
    return Promise.resolve(response.data.data.tourAvailability);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourTags = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/execute`, {
      data: {
        operationName: "tourTags",
        operationNameCustom: "tourTags",
      },
    });
    return Promise.resolve(response.data.data.tourTags[0].items);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourGroups = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/execute`, {
      data: {
        operationName: "tourGroups",
        operationNameCustom: "tourGroups",
      },
    });
    return Promise.resolve(response.data.data.tourGroups);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourCountry = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/execute`, {
      data: {
        operationName: "countries",
        operationNameCustom: "countries",
      },
    });
    return Promise.resolve(response.data.data.countries);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourBySlug = async (slug) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/tours/detail`, {
      data: {
        operationName: "tour",
        operationNameCustom: "tour",
        variables: slug,
      },
    });
    return Promise.resolve(response.data.data.tour);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourBySlugWithItenerary = async (slug) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/tours/detail`, {
      data: {
        operationName: "tour",
        operationNameCustom: "tourWithItenerary",
        variables: slug,
      },
    });
    return Promise.resolve(response.data.data.tour);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourTagsV2 = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tags",
        operationNameCustom: "tagsV2",
      },
    });
    return Promise.resolve(response.data.data.tags[0].items);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourGroupsV2 = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "groups",
        operationNameCustom: "groupsV2",
      },
    });
    return Promise.resolve(response.data.data.groups);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getToursV2 = async (filters) => {
  if (_.isBoolean(filters?.page) && filters?.page === false)
    return Promise.reject("Page has exceeded the limit");
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tours",
        operationNameCustom: "toursV2",
        variables: filters,
      },
    });

    console.log('itemtour', response)

    return Promise.resolve(response.data.data.tours);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourBySlugV2 = async (slug) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tour",
        operationNameCustom: "tourV2",
        variables: slug,
      },
    });
    // console.log(
    // "🚀 ~ file: tour.service.js:163 ~ getTourBySlugV2 ~ response:",
    // response
    // );
    // hide departure date ketika date lebih kecil dari today yyyy-mm-dd
    const today = new Date();
    const departures = response.data.data.tour.departures;
    const departureDate = departures.filter((item) => {
      const date = new Date(item.date);
      return date >= today;
    });
    response.data.data.tour.departures = departureDate;
    return Promise.resolve(response.data.data.tour);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourBySlugWithIteneraryV2 = async (slug) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tour",
        operationNameCustom: "tourWithIteneraryV2",
        variables: slug,
      },
    });
    // hide departure date ketika date lebih kecil dari today yyyy-mm-dd
    const today = new Date();
    const departures = response.data.data.tour.departures;
    const departureDate = departures.filter((item) => {
      const date = new Date(item.date);
      return date >= today;
    });
    response.data.data.tour.departures = departureDate;

    // console.log(
    // "🚀 ~ file: tour.service.js:181 ~ getTourBySlugWithIteneraryV2 ~ response:",
    // response
    // );
    return Promise.resolve(response.data.data.tour);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourMomentsBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tour-golden-moments?filters[slug][$eq]=${slug}&filters[isActive][$eq]=true&populate=*`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const bookingTour = async (data, token) => {
  const traveler = data.traveler.map((item) => {
    const card = item.expired_date.split("-");
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
        cardType: "PP",
        cardNum: item.passport_number,
        cardIssuePlace: item.publisher_country,
        cardExpired: {
          year: parseInt(card[0]),
          month: parseInt(card[1]),
          day: parseInt(card[2]),
        },
      },
    };
  });
  let payload = data;
  payload.traveler = traveler;
  // payload = encryptData(JSON.stringify(payload));
  try {
    const response = await axios.post(
      `${BASE_URL}/orders/tours/booking`,
      payload
      // {
      //   headers: {
      //     "Content-Type": "text/plain",
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getOrderDetailTour = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/tour/detail`, data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTourCountryV2 = async (slugGroup) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/countries?filters[id_group][$eq]=${slugGroup}`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getTotalDataTourV2 = async (filters) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tours",
        operationNameCustom: "toursTotalDataV2",
        variables: filters,
      },
    });
    return Promise.resolve(response.data.data.tours);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const postMoment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/tour-golden-moments`, data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTourHighlights = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tour-highlights`, {
      params: {
        sort: "sort:asc",
        populate: ["image"],
      },
    });
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getToursQuery = async (query) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tours",
        operationNameCustom: "toursV2Query",
        variables: {
          page: 0,
          itemPerPage: 10,
          query,
        },
      },
    });
    return Promise.resolve(response.data.data.tours);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSlugTours = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tours",
        operationNameCustom: "toursV2Query",
      },
    });
    return Promise.resolve(response.data.data.tours);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTourAreas = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tour-areas?populate=*&sort=order:asc`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTourSubAreas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tour-sub-areas`);
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTourAreaWithSubAreas = async (slug) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tour-areas?filters[slug][$eq]=${slug}&populate[0]=sub_areas.image&populate[1]=image`
    );
    return Promise.resolve(response.data.data[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTourSubAreaWithCountries = async (slug) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tour-sub-areas?filters[slug][$eq]=${slug}&populate[0]=countries.image_mobile&populate[1]=image`
    );
    return Promise.resolve(response.data.data[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTourAirlines = async (filters) => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/v2/execute`, {
      data: {
        operationName: "tours",
        operationNameCustom: "tourAirlines",
        variables: filters,
      },
    });
    return Promise.resolve(getTourAirlineAvailable(response.data.data.tours));
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
