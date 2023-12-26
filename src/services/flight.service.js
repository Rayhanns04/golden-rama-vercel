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

export const getFlights = async (data, isSmartCombo) => {
  try {
    
    // const payloadTemp = {
    //   data: {
    //     ...data,
    //     isSmartCombo: `${isSmartCombo}`,
    //   },
    // }

    // console.log('itemku', payloadTemp)
    
    const response = await axios.post(`${BASE_URL}/orders/flight/available`, {
      data: {
        ...data,
        isSmartCombo: `${isSmartCombo}`,
      },
    });

    const dataFlights = response.data;
  
    return Promise.resolve(dataFlights);
  } catch (error) {
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
      mobilePhone: `${item?.mobile_phone}`, // wajib
      otherPhone: `${item?.mobile_phone}`,
      idNumber: item?.id_number, // wajib
      nationality: item?.country,
      adultAssoc: (item?.paxType === 'INF') ? (item?.i + 1) : null,
      passportNumber: item?.passport_number,
      passportExpire: item?.expired_date,
      passportOrigin: item?.publisher_country,
      // emergencyFullName: (item?.paxType === 'INF' || item?.paxType === 'CHD' || (item?.paxType === 'ADT' && item?.i !== 0)) ? `${data.traveler[0].emergency_fullname}` : `${item?.emergency_fullname}`, // wajib
      // emergencyPhone: (item?.paxType === 'INF' || item?.paxType === 'CHD' || (item?.paxType === 'ADT' && item?.i !== 0)) ? `${data.traveler[0].emergency_phone}` : `${item?.emergency_phone}`, // wajib
      // emergencyEmail: (item?.paxType === 'INF' || item?.paxType === 'CHD' || (item?.paxType === 'ADT' && item?.i !== 0)) ? `${data.traveler[0].emergency_email}` : `${item?.emergency_email}`, // wajib
      seats: [],
      ssrs: []
    };

    return passenger.push(passengerItem);
  })

  data.journeys.flights.map((item, indexJourney)=>{
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
        num: indexJourney,
        seq: 0,
      }
      segment.push([segmentUpdate])
      airlineNumber = item?.Airline
    } else {
      let segmentTemp = []
      item?.ConnectingFlights.map((item2, indexJourneyConnecting)=>{
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
          num: indexJourney,
          seq: indexJourneyConnecting,
        }
        segmentTemp.push(segmentUpdate2)
        airlineNumber = item?.Airline
      })
      segment.push(segmentTemp)
    }
  })

  const fullNameContact = data.customer.fullName.split(" ")

  const bodyForm = {
    fareDetail: data?.fareDetail,
    isInternational: `${data?.isInternational}`,
    adult: Number(data?.query?.adult),
    child: Number(data?.query?.child),
    infant: Number(data?.query?.infant),
    contact : {
      email: data?.customer?.email,
      title: data?.traveler[0]?.title,
      firstName: fullNameContact[0],
      lastName: fullNameContact[fullNameContact?.length - 1],
      homePhone: data?.customer?.phone,
      mobilePhone: data?.customer?.phone,
    },
    passengers: passenger,
    segments: segment,
    callbackUri: "",
    flightType: flightTypeCurrent,
    transaction: {
      promoCode: data?.transaction?.promoCode,
      subTotal: data?.transaction?.subTotal,
      total: data?.transaction?.total,
      serviceFee: data?.transaction?.serviceFee,
      discountPromo: data?.transaction?.discountPromo,
      discount: data?.transaction?.discountPromo,
      downPayment: data?.transaction?.downPayment
    },
  }

  let payload = bodyForm;
  // payload.traveler = traveler;
  // payload = encryptData(JSON.stringify(payload));

  try {
    const response = await axios.post(
      `${BASE_URL}/orders/flight/booking`, {
        data: payload
      },
      {
        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
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
