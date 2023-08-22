import axios from "axios";
import { filter } from "underscore";
import { convertToArray } from "../helpers";
import date, { getMonthFromMonthName } from "../helpers/date";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getPackageDestination = async (isDomestic, search) => {
  try {
    const qs = require("qs");
    const query = qs.stringify(
      {
        filters: {
          isDomestic: { $eq: isDomestic },
        },
        _q: search,
        sort: ["name"],
      },
      { encodeValuesOnly: true }
    );
    const response = await axios.get(
      `${BASE_URL}/package-destinations?${query}`
    );
    response.data.data.map((item) => ({
      ...item,
      type: isDomestic ? "Kota" : "Negara",
    }));
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPackageDestinationWithPackageAvailability = async (
  isDomestic,
  search
) => {
  try {
    const qs = require("qs");
    const response = await getPackageDestination(isDomestic, search);
    // const value = await Promise.all(
    //   response.map(async (item) => {
    //     const query = qs.stringify({
    //       filters: { $and: [{ destination: { name: { $eq: search } } }] },
    //     });
    //     return Promise.resolve(
    //       (item.attributes.tourAvailability = await axios.get(
    //         `${BASE_URL}/packages?${query}`
    //       ))
    //     );
    //   })
    // );
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPackageTags = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/grts/execute`, {
      data: {
        operationName: "packageTags",
        operationNameCustom: "packageTags",
      },
    });
    return Promise.resolve(response.data.data.packageTags[0].items);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPackageCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/package-categories`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const bookingPackages = async (data, token) => {
  try {
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

    const parseData = {
      transaction: data.transaction,
      traveler: traveler,
      customer: data.customer,
      packages: {
        isDomestic: data.package.package.isDomestic,
        departureId: data.package.departures.id,
        departureDate: data.package.departures.date,
        departureCode: data.package.departures.code,
        packagesTypeId: data.package.package.id.toString(),
        title: data.package.package.title,
        category: data.package.package.category,
        type: data.package.type,
        ...data.package.participants,
      },
    };
    // const encryptedData = encryptData(JSON.stringify(parseData));
    const response = await axios.post(
      `${BASE_URL}/orders/packages/booking`,
      parseData
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

export const getAllPackages = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/packages?[filters][isActive][$eq]=true`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getPackages = async (filters, pageParam = 1) => {
  try {
    let parseEndDate, parseStartDate;
    const parseFilter = {};
    const parseSort = {};
    parseFilter.destination = {
      isDomestic: { $eq: filters.isDomestic },
      name: { $eq: filters.destination },
    };
    if (filters.category) {
      parseFilter.category = {
        $or: convertToArray(filters.category).map((item) => {
          return { name: { $eq: item } };
        }),
      };
    }
    let month, year;
    month = getMonthFromMonthName(new Date().getMonth());
    year = parseInt(new Date().getFullYear());
    if (filters.period_year && filters.period_month) {
      month = getMonthFromMonthName(filters.period_month);
      year = parseInt(filters.period_year);
      parseEndDate = new Date(year, month, 0);
      parseStartDate = new Date(`${year}-${month}`);
    }
    parseFilter.itineraries = {
      packageDepartures: {
        // ...(true && {
        //   $and: [
        //     {
        //       date: { $gte: date(parseStartDate ?? new Date(), "yyyy-MM-dd") },
        //     },
        //     {
        //       ...(filters.period_year &&
        //         filters.period_month && {
        //           date: {
        //             $lte: date(parseEndDate, "yyyy-MM-dd"),
        //           },
        //         }),
        //     },
        //   ],
        // }),
        date: {
          $gte: date(parseStartDate ?? new Date(), "yyyy-MM-dd"),
          ...(filters.period_year &&
            filters.period_month && {
              $lte: date(parseEndDate, "yyyy-MM-dd"),
            }),
        },
      },
      ...(filters.max_price &&
        filters.min_price && {
          packageTypes: {
            $and: [
              { startingPrice: { $gte: filters.min_price } },
              { startingPrice: { $lte: filters.max_price } },
            ],
          },
        }),
      ...(filters.duration && {
        duration: {
          ...(filters.duration === "< 1 Week"
            ? { $lte: 6 }
            : filters.duration === "> 1 Week"
            ? { $gte: 6 }
            : { $gte: 0 }),
        },
      }),
    };
    // if (filters.sort) {
    //   switch (filters.sort) {
    //     case "LOWEST_PRICE":
    //       parseSort.itineraries = {
    //         packageTypes: {
    //           startingPrice: "ASC",
    //         },
    //       };
    //       break;
    //     case "HIGHEST_PRICE":
    //       parseSort.itineraries = {
    //         packageTypes: {
    //           startingPrice: "DESC",
    //         },
    //       };
    //       break;
    //     case "SHORTEST_DURATION":
    //       parseSort.itineraries = {
    //         itineraries: {
    //           duration: "ASC",
    //         },
    //       };
    //     case "LONGEST_DURATION":
    //       parseSort.itineraries = {
    //         itineraries: {
    //           duration: "DESC",
    //         },
    //       };

    //     default:
    //       break;
    //   }
    // }
    const qs = require("qs");
    const query = qs.stringify(
      {
        filters: parseFilter,
        sort: parseSort,
        pagination: { page: pageParam, pageSize: 12 },
      },
      { encodeValuesOnly: true }
    );
    const response = await axios.get(
      `${BASE_URL}/package/listPackages?${query}&[filters][isActive][$eq]=true`
    );
    if (response.data.data.length > 0) {
      const results = [];
      response.data.data.map((item) => {
        if (!results.find((result) => result.id === item.id)) {
          results.push(item);
        }
      });
      response.data.data = results;
    }
    if (filters.sort) {
      switch (filters.sort) {
        case "LOWEST_PRICE":
          const sortLowestPrice = response.data.data.sort((a, b) => {
            return a.startingPrice - b.startingPrice;
          });
          response.data.data = sortLowestPrice;
          break;
        case "HIGHEST_PRICE":
          const sortHighestPrice = response.data.data.sort((a, b) => {
            return b.startingPrice - a.startingPrice;
          });
          response.data.data = sortHighestPrice;
          break;
        case "SHORTEST_DURATION":
          const sortShortestDuration = response.data.data.sort((a, b) => {
            return a.duration - b.duration;
          });
          response.data.data = sortShortestDuration;
          break;
        case "LONGEST_DURATION":
          const sortLongestDuration = response.data.data.sort((a, b) => {
            return b.duration - a.duration;
          });
          response.data.data = sortLongestDuration;
          break;
        default:
          break;
      }
    }
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getPackageDetail = async (slug) => {
  try {
    const qs = require("qs");
    const query = qs.stringify(
      {
        populate: "*",
      },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    const response = await axios.get(
      `${BASE_URL}/package/detailPackage/${slug}${query}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getOrderDetailPackage = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/tour/detail`, data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
