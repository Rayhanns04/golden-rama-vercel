import axios from "axios";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getAirlines = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/airlines`);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getAirports = async (search) => {
  try {
    const response = await axios.get(`${BASE_URL}/airports?_q=${search}`);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getRecommendedAirports = async () => {
  const cities = [
    "CGK",
    "Medan",
    "Surabaya",
    "Yogyakarta",
    "Denpasar",
    "Makassar",
    "Singapore",
    "Bangkok",
  ];
  const responseArray = [];
  try {
    await Promise.all(
      cities.map(async (item) => {
        const response = await getAirports(item);
        return responseArray.push(...response);
      })
    ).then((data) => {
      return Promise.resolve(data);
    });
    return Promise.resolve(responseArray);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getFlights = async (data, issmartcombo) => {
  try {
    // console.log('responseReq', data)
    const response = await axios.post(`${BASE_URL}/orders/flight/available`, {
      data: data,
    });
    const dataFlights = response.data;
    if (
      dataFlights?.filter?.[0]?.combinedJourneys?.length > 0 &&
      dataFlights &&
      issmartcombo == true
    ) {
      dataFlights.data[0].journeys = await dataFlights.data[0].journeys.concat(
        dataFlights.filter[0].combinedJourneys?.map((item) => {
          if (
            item?.journeys?.[0]?.segments?.length > 0 &&
            item?.journeys?.[0] !== undefined &&
            item?.journeys?.[0] !== null &&
            item !== undefined &&
            item !== null
          ) {
            const data = {
              ...item?.journeys?.[0],
              isCombine: true,
            };
            return data;
          }
        })
      );
      //jika ada additionalData.data[0].journeys yang undefined maka hapus
      dataFlights.data[0].journeys = await dataFlights.data[0].journeys.filter(
        (item) => item !== undefined
      );
    }
    return Promise.resolve(dataFlights);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const resendEticket = async ({ orderNumber, email }, jwt) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/send/eticket`,
      {
        data: {
          orderNumber: orderNumber,
        },
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

export const getDetailPrice = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/flight/price`, {
      data: data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const bookingFlight = async (data, token) => {
  const traveler = data.traveler.map((item) => {
    const card = item.expired_date.split("-");
    return {
      paxType: item.paxType.toUpperCase(),
      first_name: item.first_name,
      last_name: item.last_name,
      title: item.title,
      dob: item.dob,
      country: item.country != "" ? item.country : "ID",
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
                year: parseInt(card[0]),
                month: parseInt(card[1]),
                day: parseInt(card[2]),
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
      `${BASE_URL}/orders/flight/booking`,
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
    const response = await axios.post(`${BASE_URL}/orders/flight/detail`, data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};
