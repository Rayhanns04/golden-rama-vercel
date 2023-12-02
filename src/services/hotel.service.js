import axios from "axios";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;
const LOCAL_URL = process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL_API;

export const searchForm = async (search, { page, pageSize }) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/orders/hotels/search?q=${search}&page=${page}&pageSize=${pageSize}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getHotels = async (filters) => {
  try {
    let response;
    response = await axios.post(`${BASE_URL}/orders/hotels2`, filters);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getHotelDetail = async (code) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/orders/hotels/details?language=IND&useSecondaryLanguage=true&hotelCode=${parseInt(
        code
      )}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const hotelAvailability = async (filters) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/orders/hotels/details`,
      filters
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const checkRate = async (rateKey) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/hotels/rate`, {
      rooms: [{ rateKey }],
    });
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const bookingHotel = async (payload, token) => {
  try {
    const [name, ...surname] = payload.customer.fullName.split(" ");
    const paxes = [];
    for (let i = 0; i < payload.hotel.roomId; i++) {
      payload.traveler.forEach((item) => {
        paxes.push({
          type: item.paxType,
          name: item.fullname,
          roomId: i + 1,
        });
      });
    }
    const data = {
      journeys: [
        {
          holder: {
            name,
            surname: surname.join(" ") || name,
          },
          rooms: [
            {
              rateKey: payload.hotel.rateKey,
              paxes: paxes,
            },
          ],
          clientReference: "IntegrationAgency",
          remark: payload.remark,
          tolerance: 2,
        },
      ],
      transaction: payload.transaction,
      traveler: payload.traveler.map((item) => {
        const [first_name, ...last_name] = item.fullname.split(" ");
        return {
          first_name,
          last_name: last_name.join(" "),
          title: item.title,
          country: "ID",
        };
      }),
      customer: payload.customer,
      title: payload.title,
      phone: payload.phone,
    };
    const encryptedData = encryptData(JSON.stringify(data));
    const response = await axios.post(
      `${BASE_URL}/orders/hotels/booking`,
      encryptedData,
      {
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOrderDetailHotel = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/hotels/detail`, data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    // console.error(error);

    return Promise.reject(error);
  }
};
