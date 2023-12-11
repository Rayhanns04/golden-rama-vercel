import axios from "axios";
import jwt_decode from "jwt-decode";
import QueryString from "qs";
import qs from "qs";
import date from "../helpers/date";
import _ from "underscore";
import { encryptData } from "../helpers/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getOrigins = async (search) => {
  try {
    const response = await axios.get(`${BASE_URL}/zurich-origins?_q=${search}`);
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getDestinationsRegions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/zurich-destination-regions`);
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getDestinations = async (id, search) => {
  try {
    if (!id) {
      return Promise.resolve([]);
    }
    const response = await axios.get(
      `${BASE_URL}/zurich-destinations?populate=*&filters[regionId][regionId][$eq]=${id}&_q=${search}`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPackageType = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/zurich/package-type`);
    return Promise.resolve(response.data.PackageTypes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getInsuranceProducts = async ({ query }) => {
  try {
    //create DOB 30 years ago
    const dateOfBirth = new Date();
    dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 30);
    const dateOfBirthString = new Date(dateOfBirth).toISOString().split("T")[0];
    let params = QueryString.stringify({
      ...query,
      RegionID: query.RegionID,
      DestinationID: query.DestinationID,
      PackageTypeID: query.PackageTypeID,
      TravelStartDate: query.travel_start_date,
      TravelEndDate: query.travel_end_date,
      DateOfBirth: dateOfBirthString,
    });
    const response = await axios.get(
      `${BASE_URL}/orders/zurich/products?${params}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOrderDetail = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/hotels/detail`, data);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const bookingInsurance = async (data, token) => {
  try {
    const primaryCustomer = data.traveler[0];
    const customers = data.traveler?.map((item) => ({
      ...item,
      address: item.address?.replace(",", " "),
    }));
    const OriginID = await getOriginsIDByName(data.journeys[0].OriginID);
    const parseData = {
      ...data,
      journeys: [
        {
          ...data.journeys?.[0],
          OriginID: OriginID,
          AdditionalDestinationIDs:
            data.journeys?.[0]?.AdditionalDestinationIDs ?? "",
          AlreadyTravelling: data.journeys?.[0]?.AlreadyTravelling ?? "",
          DepartureDate: data.journeys?.[0]?.DepartureDate ?? "",
          CoverageIDs: _.pluck(data.journeys?.[0].additionalCoverage, "ID")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          TravelNeedID: customers?.[0]?.TravelNeedID,
          Relationships: _.pluck(customers, "relationship")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          FirstNames: _.pluck(customers, "first_name")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          LastNames: _.pluck(customers, "last_name")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          Genders: _.pluck(customers, "gender")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          DateOfBirths: _.pluck(customers, "dob")
            .filter((item) => {
              return Boolean;
            })
            .map((item) => {
              return date(new Date(item), "yyyy-MM-dd");
            })
            .join(","),
          Emails: _.pluck(customers, "email")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          PersonalIDTypes: _.pluck(customers, "passport_type")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          PersonalIDNos: _.pluck(customers, "passport")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          Addresses: _.pluck(customers, "address")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          Cities: _.pluck(customers, "city")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          PlaceOfBirths: _.pluck(customers, "birthplace")
            .filter((item) => {
              return Boolean;
            })
            .join(","),
          PhoneNumbers: _.pluck(customers, "phone")
            .filter((item) => {
              return item !== undefined;
            })
            .map((item) => {
              return `62${item}`;
            })
            .join(","),
          ContactFullName: `${primaryCustomer.first_name} ${primaryCustomer.last_name}`,
          ContactEmail: primaryCustomer.email,
          ContactPhoneNumber: `62${primaryCustomer.phone}`,
          ContactPersonalIDNo: primaryCustomer.passport,
          SendEPolicy: 1,
        },
      ],
    };
    const encryptedData = encryptData(JSON.stringify(parseData));
    const response = await axios.post(
      `${BASE_URL}/orders/zurich/booking`,
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

export const getOriginsIDByName = async (filter) => {
  try {
    let query;
    if (filter) {
      query = qs.stringify(
        {
          filters: {
            name: {
              $containsi: filter,
            },
          },
        },
        { encodeValuesOnly: true, addQueryPrefix: true }
      );
    }
    const response = await axios.get(
      `${BASE_URL}/orders/zurich/origin${query}`
    );
    return Promise.resolve(response.data?.[0]?.originId);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getTravelNeeds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/zurich/travel-needs`);
    return Promise.resolve(response.data.TravelNeeds);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getTravelNeedById = async (id) => {
  const travelNeeds = await getTravelNeeds();
  return travelNeeds.find((item) => item.ID === id);
};

export const getAdditionalCoverage = async (data) => {
  try {
    const parseQuery = qs.stringify(
      {
        ProductID: data.ID,
        TravelStartDate: data.travel_start_date,
        TravelEndDate: data.travel_end_date,
        Adult: data?.adults,
        Child: data?.children,
        RegionID:data?.RegionID,
        DestinationID:data?.DestinationID,
        NumOfPersons:Number(data?.adults) + Number(data?.children),
        CoverageIDs:"",
        DateOfBirths:"2001-12-10",
      },
      {
        encodeValuesOnly: true,
        addQueryPrefix: true,
      }
    );
    // console.log('itemku', parseQuery)
    
    const response = await axios.get(
      `${BASE_URL}/orders/zurich/coverages${parseQuery}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
