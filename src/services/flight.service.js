import axios from "axios";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;
const BASE_URL_SECOND = process.env.REACT_APP_BACKEND_URL;

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

export const getDetailPrice = async (data, jwt) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/flight/price`, 
    {
      data: data,
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    );
    // console.log('iniresponse', response, jwt)
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const bookingFlight = async (data, token) => {

  let passenger = []
  let segment = []
  let airlineNumber = ''
  let flightTypeCurrent = data?.journeys?.flights[0]?.FlightType

  data.traveler.map((item)=>{
    const today = new Date();
    const birthDate = new Date(item?.dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const passengerItem = {
      index: item?.key + 1,
      type: item?.paxType === 'ADT' ? 1 : item?.paxType === 'CHD' ? 2 : 3,
      title: item?.title,
      firstName: item?.first_name,
      lastName: item?.last_name,
      isSeniorCitizen: (age > 65) ? true : false,
      birthDate: item?.dob,
      email: item?.email,
      homePhone: `${item?.mobile_phone}`,
      mobilePhone: `${item?.mobile_phone}`,
      otherPhone: `${item?.mobile_phone}`,
      idNumber: item?.id_number,
      nationality: item?.country,
      adultAssoc: (item?.paxType === 'INF') ? 1 : null,
      passportNumber: item?.passport_number,
      passportExpire: item?.expired_date,
      passportOrigin: item?.publisher_country,
      emergencyFullName: item?.first_name,
      emergencyPhone: `${item?.mobile_phone}`,
      emergencyEmail: item?.email,
      seats: [],
      ssrs: []
    };
    return passenger.push(passengerItem);
  })

  data.journeys.flights.map((item, index)=>{
    if(item?.TotalTransit === 0){
      const segmentCurrent = item?.ClassObjects[0]
      const segmentUpdate = {
        classId: segmentCurrent.Id,
        Airline: item?.Airline,
        flightNumber: item?.Number,
        origin: item?.Origin,
        departDate: item?.DepartDate,
        departTime: item?.DepartTime,
        destination: item?.Destination,
        arriveDate: item?.ArriveDate,
        arriveTime: item?.ArriveTime,
        classCode: segmentCurrent?.Code,
        flightId: segmentCurrent?.FlightId,
        num: 0,
        seq: 0,
      }
      segment.push(segmentUpdate)
      airlineNumber = item?.Airline
    } else {
      item?.ConnectingFlights.map((item2)=>{
        const segmentCurrent2 = item2?.ClassObjects[0]
        const segmentUpdate2 = {
          classId: segmentCurrent2.Id,
          Airline: item2?.Airline,
          flightNumber: item2?.Number,
          origin: item2?.Origin,
          departDate: item2?.DepartDate,
          departTime: item2?.DepartTime,
          destination: item2?.Destination,
          arriveDate: item2?.ArriveDate,
          arriveTime: item2?.ArriveTime,
          classCode: segmentCurrent2?.Code,
          flightId: segmentCurrent2?.FlightId,
          num: 0,
          seq: 0,
        }
        segment.push(segmentUpdate2)
        airlineNumber = item?.Airlin
      })
    }
  })

  const fullNameContact = data.customer.fullName.split(" ")

  const bodyForm = {
    isInternational: data?.isInternational,
    contact : {
      email: data?.customer?.email,
      title: data?.traveler[0]?.title,
      firstName: fullNameContact[0],
      lastName: fullNameContact[fullNameContact?.length - 1],
      homePhone: data?.customer?.phone,
      mobilePhone: data?.customer?.phone,
    },
    passengers: passenger,
    segment: segment,
    callbackUri: "google.com",
    flightType: flightTypeCurrent
  }

  let payload = bodyForm;
  console.log('itemku1', data, payload)
  // payload.traveler = traveler;
  // payload = encryptData(JSON.stringify(payload));

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
