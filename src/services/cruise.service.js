import axios from "axios";
import date, { getMonthFromMonthName } from "../helpers/date";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;
export async function getCruiseDestinations() {
  try {
    const response = await axios.get(`${BASE_URL}/cruise-destinations`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export async function getCruiseShip() {
  try {
    const response = await axios.get(`${BASE_URL}/cruise-ships`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export async function getCruiseDetail(slug) {
  try {
    const response = await axios.get(`${BASE_URL}/cruise/detailCruise/${slug}`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export async function bookingCruise(data, token) {
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
      ...data,
      traveler: traveler,
      cruise: {
        cruiseId: data.cruise.cruise.id.toString(),
        departureId: data.cruise.departures.id,
        departureCode: data.cruise.departures.code,
        departureDate: data.cruise.departures.date,
        title: data.cruise.cruise.title,
        type: data.cruise.cruise.type,
        ...data.cruise.participants,
        cabins: data.cruise.cabin,
        cabin: data.cruise.type,
      },
    };
    // const encryptedData = encryptData(JSON.stringify(parseData));
    const response = await axios.post(
      `${BASE_URL}/orders/cruises/booking`,
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
}

export const getOrderDetailCruise = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/tour/detail`, data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getAllCruises = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/cruises?[filters][isActive][$eq]=true`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export async function getCruises({ filters = null, pageParam = 1 }) {
  let parseEndDate, parseStartDate;
  const qs = require("qs");
  const parseFilter = {};
  const parseSort = {};
  try {
    if (filters) {
      if (filters.destination) {
        parseFilter.destination = {
          name: {
            $eq: filters.destination,
          },
        };
      }
      if (filters.ship) {
        parseFilter.ship = {
          name: { $eq: filters.ship },
        };
      }
      if (filters.period_year && filters.period_month) {
        const month = getMonthFromMonthName(filters.period_month);
        const year = parseInt(filters.period_year);
        parseEndDate = new Date(year, month, 0);
        parseStartDate = new Date(`${year}-${month}`);
      }
      parseFilter.itineraries = {
        cruiseDepartures: {
          ...(filters.period_year &&
            filters.period_month && {
              $and: [
                {
                  date: {
                    $lte: date(parseEndDate, "yyyy-MM-dd"),
                  },
                },
                { date: { $gte: date(parseStartDate, "yyyy-MM-dd") } },
              ],
            }),
          // ...(filters.max_price &&
          //   filters.min_price && {
          //     $and: [
          //       { startingPrice: { $gte: filters.min_price } },
          //       { startingPrice: { $lte: filters.max_price } },
          //     ],
          //   }),
        },
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
      //     case "EARLIER_DEPARTURE":
      //       parseSort.itineraries = {
      //         cruiseDepartures: {
      //           date: "ASC",
      //         },
      //       };
      //       break;
      //     case "LATEST_DEPARTURE":
      //       parseSort.itineraries = {
      //         cruiseDepartures: {
      //           date: "DESC",
      //         },
      //       };
      //       break;
      //     case "LOWEST_PRICE":
      //       parseSort.itineraries = {
      //         cruiseDepartures: {
      //           startingPrice: "ASC",
      //         },
      //       };
      //       break;
      //     case "HIGHEST_PRICE":
      //       parseSort.itineraries = {
      //         cruiseDepartures: {
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
    }
    const query = qs.stringify(
      {
        filters: parseFilter,
        sort: parseSort,
        pagination: { page: pageParam },
      },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    const response = await axios.get(
      `${BASE_URL}/cruise/listCruises${query}&[filters][isActive][$eq]=true`
    );
    //filter cruises

    if (filters && filters.max_price && filters.min_price) {
      const cruises = response.data.data.map((cruise) => {
        return (
          cruise.startingPrice >= filters.min_price &&
          cruise.startingPrice <= filters.max_price
        );
      });
      response.data.data = response.data.data.filter((cruise, index) => {
        return cruises[index];
      });
    }
    if (filters && filters.sort) {
      switch (filters.sort) {
        case "EARLIER_DEPARTURE":
          const earlier = response.data.data.sort((a, b) => {
            return (
              new Date(a.cruiseDepartures?.[0]?.[0]?.date) -
              new Date(b.cruiseDepartures?.[0]?.[0]?.date)
            );
          });
          response.data.data = earlier;
          break;
        case "LATEST_DEPARTURE":
          const latest = response.data.data.sort((a, b) => {
            //get last departure date
            const last = a.cruiseDepartures?.[0]?.length - 1;
            return (
              new Date(b.cruiseDepartures?.[0]?.[last]?.date) -
              new Date(a.cruiseDepartures?.[0]?.[last]?.date)
            );
          });
          response.data.data = latest;
          break;
        case "LOWEST_PRICE":
          const lowest = response.data.data.sort((a, b) => {
            return a.startingPrice - b.startingPrice;
          });
          response.data.data = lowest;
          break;
        case "HIGHEST_PRICE":
          const highest = response.data.data.sort((a, b) => {
            return b.startingPrice - a.startingPrice;
          });
          response.data.data = highest;
          break;
        case "SHORTEST_DURATION":
          const shortest = response.data.data.sort((a, b) => {
            return a.duration - b.duration;
          });
          response.data.data = shortest;
          break;
        case "LONGEST_DURATION":
          const longest = response.data.data.sort((a, b) => {
            return b.duration - a.duration;
          });
          response.data.data = longest;
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
}
