import uniqBy from "lodash/uniqBy";
import filter from "lodash/filter";
import sumBy from "lodash/sumBy";
import find from "lodash/find";
import map from "lodash/map";
import axios from "axios";
import moment from "moment";
import countries from "../mocks/countries.json";
import { AsYouType, parsePhoneNumber } from "libphonenumber-js";
import _ from "underscore";
import { convertToRupiah } from "./delimeterRupiah";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const indexMonth = [
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const tourPromo = [
  "harbolnas-amazing-78-north-svalbard-island-blue-hour-experience-lofoten-aurora-hunting",
  "harbolnas-favorite-west-coast-usa-monterey-new-year-s-eve-at-disneyland",
  "harbolnas-favorite-taiwan-alishan-cing-jing-farm",
  "harbolnas-amazing-winter-oishi-japan-fujiten-snow-park-taipei-city",
  "harbolnas-favorite-turkey-dubai-bosphorus-cruise-sky-view-glass-walk",
];

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export function commaSeparatedValues(array) {
  return typeof array === "object" ? array.join(", ") : array;
}

export function addDays(currentDate, number) {
  const date = new Date(currentDate);
  const newDate = new Date(date.setDate(date.getDate() + number));

  return newDate.toISOString().slice(0, 10);
}

export function addDaysWithMonthName(currentDate, number) {
  const date = new Date(currentDate);
  const newDate = new Date(date.setDate(date.getDate() + number));

  return `${newDate.getDate()} ${monthNames[newDate.getMonth()].slice(
    0,
    3
  )} ${newDate.getFullYear()}`;
}

export function convertToArray(array) {
  const convert = [].concat(array).map((item) => item);
  if (array) return convert;
  else [];
}

export function convertRupiah(price = null) {
  // let rupiah = "";
  // if (price == null) return null;
  // if (price.length !== 0) {
  //   let priceRev = price.toString().split("").reverse().join("");
  //   for (let i = 0; i < priceRev.length; i++) {
  //     if (i % 3 == 0) rupiah += priceRev.substr(i, 3) + ".";
  //   }
  //   return rupiah
  //     .split("", rupiah.length - 1)
  //     .reverse()
  //     .join("");
  // }
  if (price) {
    return parseInt(price).toLocaleString("id-ID", {
      maximumFractionDigits: 0,
    });
  }
  return null;
}

export function convertTimeToCustomFormat(inputTime) {
  const timeRegex = /^(\d{2}):(\d{2})$/;
  if (timeRegex.test(inputTime)) {
    const [hours, minutes] = inputTime.split(':');  
    const formattedTime = `${parseInt(hours)}j ${parseInt(minutes)}m`;
    return formattedTime;
  } else {
    return "Format waktu tidak valid";
  }
}

export function convertDate(date) {
  const newDate = new Date(date);
  return newDate.toISOString().slice(0, 10);
}

export function convertDateWithMonthName(date) {
  if (isNaN(Date.parse(date))) return "Invalid Date";
  const newDate = new Date(date);
  return `${newDate.getDate()} ${monthNames[newDate.getMonth()].slice(
    0,
    3
  )} ${newDate.getFullYear()}`;
  // return newDate.toISOString().slice(0, 10);
}

export function convertTime(date) {
  const newDate = new Date(date);
  return newDate.toLocaleTimeString().slice(0, 4);
}

export function convertDateFlight(date) {
  const newDate = new Date(date);
  const result = `${newDate.getMonth() + 1}-${newDate.getDate()}`;
  return result;
}

export function convertDateFlightWithYear(date) {
  const newDate = new Date(date);
  const result = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
  // console.log(result, 'result');
  return result;
}

export function convertDateFlightPage(date) {
  const currentDate = new Date(date);
  const options = { year: "2-digit", month: "short", day: "numeric" };

  return `${dayNames[currentDate.getDay()]}, ${currentDate.toLocaleDateString(
    "id-ID",
    options
  )}`;
}

export function convertTimeFlightPage(date) {
  const event = new Date(date);
  const options = { hour: "2-digit", minute: "2-digit" };

  return event.toLocaleTimeString("id-ID", options);
}

export function getClassCode(code) {
  const codeNow = code[0]
  const cabinClass = [
    { label: "Economy", value: "Economy" },
    { label: "Premium Economy", value: "PremiumEconomy" },
    { label: "Business", value: "Business" },
    { label: "First", value: "First" },
    { label: "Premium First", value: "PremiumFirst" },
    // { label: "Economy", value: "E" },
    // { label: "Premium Economy", value: "PE" },
    // { label: "Business Class", value: "B" },
    // { label: "First Class", value: "F" },
  ];
  const result = cabinClass.find((item) => item.value === codeNow);
  return result?.label ?? "Not Found";
}

export function differenceDate(dateDeparture, dateArrival) {
  const date1 = new Date(dateDeparture);
  const date2 = new Date(dateArrival);

  const diff = date2 - date1;
  const diffHrs = Math.floor((diff % 86400000) / 3600000);
  const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);

  return `${diffHrs}j ${diffMins}m`;
}

export function differenceDateLong(dateDeparture, dateArrival) {
  const date1 = new Date(dateDeparture);
  const date2 = new Date(dateArrival);

  const diff = date2 - date1;
  const diffHrs = Math.floor((diff % 86400000) / 3600000);
  const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);

  return `${diffHrs} Jam ${diffMins} Menit`;
}

export function sumPriceFlight(segments) {
  let totalPrice = 0;
  for (let i = 0; i < segments.length; i++) {
    for (let j = 0; j < segments[i].fares.length; j++) {
      for (let k = 0; k < segments[i].fares[j].paxFares.length; k++) {
        totalPrice += segments[i].fares[j].paxFares[j].totalFare;
      }
    }
  }
  return totalPrice;
}

export function simplifyPaxFares(paxFares) {
  return paxFares.map((paxFare) => {
    const farePrice = paxFare.charges.reduce((acc, curr) => {
      return curr.chargeType === "FarePrice" ? acc + curr.amount : acc;
    }, 0);
    const taxPrice = paxFare.charges.reduce((acc, curr) => {
      return curr.chargeType === "Tax" ? acc + curr.amount : acc;
    }, 0);
    const paxType = paxFare.paxType;
    const total = farePrice + taxPrice;
    return { farePrice, taxPrice, paxType, total };
  });
}

// export function getAirlineAvailable(flight) {
//   // console.log('item', flight)
//   const mapAirline = flight.map((item) => {
//     // console.log('uniqAirline', item)

//     let itemId = '';
//     if(item?.TotalTransit === 0){
//       itemId = item?.Id
//     } else if(item?.TotalTransit === 1){
//       itemId = item?.ConnectingFlights[0]?.Id
//     }

//     const airline = {
//       id: itemId,
//       name: item?.AirlineName,
//     };
//     // const airline = []
//     return airline;
//   });

//   let uniqueAirline = [
//     ...new Map(mapAirline.flat(1).map((m) => [m.id, m])).values(),
//   ];
//   console.log('uniqAirline', uniqueAirline, mapAirline)
//   return uniqueAirline;
// }

export function getAirlineAvailable(flight) {
  // console.log('itemmku1', flight)
  const uniqueAirline = flight?.reduce((acc, item, index) => {
    let airlineName = item?.AirlineName;

    if (item?.TotalTransit > 0) {
      airlineName = item?.ConnectingFlights[0]?.AirlineName;
    }

    if (airlineName) {
      const existing = acc.find((el) => el.name === airlineName);
      if (!existing) {
        acc.push({
          id: `${index + 1}`,
          name: airlineName,
        });
      }
    }

    return acc;
  }, []);

  return uniqueAirline;
}

export function simplifyBodyDetailFlight(journeys, query) {
  const segmentData = journeys.segments.map((segment, index) => {
    const flightDesignator = {
      opSuffix: segment.flightDesignator.opSuffix,
      carrierCode: segment.flightDesignator.carrierCode,
      flightNumber: segment.flightDesignator.flightNumber,
    };
    if (journeys.connectingType == "THROUGH" && index > 0) {
      return {
        flightDesignator: flightDesignator,
        fareGroupCode: journeys.segments[0].fares[0].fareGroupCode,
        arrivalDateTime: segment.arrivalDateTime,
        departureDateTime: segment.departureDateTime,
        origin: segment.origin,
        destination: segment.destination,
      };
    } else {
      return {
        flightDesignator: flightDesignator,
        fareCode:
          segment?.fares?.length > 0 ? segment.fares[0].fareCode : query.class,
        fareGroupCode: journeys.segments[0].fares[0].fareGroupCode,
        arrivalDateTime: segment.arrivalDateTime,
        departureDateTime: segment.departureDateTime,
        origin: segment.origin,
        destination: segment.destination,
      };
    }
  });
  const isCombinedJourney =
    journeys?.isCombine && journeys?.isCombine && journeys?.vendorCode == "GUA"
      ? true
      : false;
  let payload = {
    originCode: query.originCode,
    destinationCode: query.destinationCode,
    adult: query.adult,
    child: query.child,
    infant: query.infant,
    journeys: [
      {
        ...journeys,
        vendorCode: journeys.vendorCode,
        segments: segmentData,
      },
    ],
    isCombinedJourneys: isCombinedJourney,
  };
  return payload;
}

export function getPaxFaresName(code) {
  const cabinClass = [
    { label: "Dewasa", value: "ADT" },
    { label: "Anak-anak", value: "CHD" },
    { label: "Bayi", value: "INF" },
  ];
  const result = cabinClass.find((item) => item.value === code);
  return result.label;
}

export function sumTaxPrice(prices) {
  let totalPrice = 0;
  for (let j = 0; j < prices.length; j++) {
    for (let i = 0; i < prices[j].taxFares.length; i++) {
      totalPrice += prices[j].taxFares[i].taxFare;
    }
  }
  return totalPrice;
}

export function convertArrayAirlines(airlines) {

  let result = ''
  
  if(airlines?.IsConnecting === false){
    result = `${airlines.AirlineName} • ${airlines.Number}`
  } else {
    airlines.ConnectingFlights.map((it, index)=>{
        result = `${it?.AirlineName} • ${it?.Number} ${airlines.ConnectingFlights?.length - 1 === index ? '' : '|' }`
    })
  }
  return result;
}
    
export function convertDateMonth(date) {
  const newDate = new Date(date);
  const result = `${newDate.getDate()} ${monthNames[newDate.getMonth()]}`;
  return result;
}

export function convertDateToMonthName(date) {
  const newDate = new Date(date);
  const result = `${monthNames[newDate.getMonth()]}`;
  return result;
}

export function formatPhoneNumber(phoneNumberString) {
  const parseNumber = new AsYouType("ID").input(phoneNumberString);
  const parseLocal = parsePhoneNumber(parseNumber, "ID").formatNational();
  return parseLocal;
}

export function attractionDynamicFormMapper(form) {
  if (form.length !== 0)
    return form.map((item) => {
      // const {type} = item
      let type;
      let options;
      let initialValue;
      switch (item.inputType) {
        case 1:
          type = "radio";
          break;
        case 2:
          type = "multiselect";
          break;
        case 3:
          type = "number";
          break;
        case 4:
          type = "text";
          break;
        case 5:
          type = "checkbox";
          initialValue = false;
          break;
        case 6:
          type = "calendar";
          break;
        case 7:
          type = "file";
          break;
        case 8:
          type = "file";
          initialValue = {};
          break;
        case 9:
          type = "text";
          break;
        case 10:
          type = "time";
          break;
        case 11:
          type = "datetime-local";
          break;
        case 12:
          type = "select";
          break;
        case 13:
          type = "text";
          break;
        case 14:
          type = "text";
          break;
        default:
          break;
      }
      return {
        ...item,
        name: item.uuid,
        label: item.name,
        type: type,
        value: initialValue,
        options: item.items,
        placeholder: item.name,
      };
      // return {
      //   name: item.uuid,
      //   label: item.name,
      //   type: type,
      //   ...(type === "radio"
      //     ? {
      //         content: (
      //           <Field name={item.uuid} type={type}>
      //             {({ field, form }) => (
      //               <FormControl
      //                 isRequired={item.required}
      //                 isInvalid={
      //                   form.errors[field.name] && form.touched[field.name]
      //                 }
      //               >
      //                 <FormLabel
      //                   htmlFor={field.name}
      //                   fontSize="sm"
      //                   color="neutral.text.medium"
      //                   textTransform="capitalize"
      //                 >
      //                   {item.name}
      //                 </FormLabel>
      //                 <CustomDropdown
      //                   title={"Pilih " + item.name}
      //                   label={
      //                     item.items.filter((item) => {
      //                       return item.value === form.values[field.name];
      //                     })?.[0]?.label
      //                   }
      //                   placeholder={"Pilih " + item.name}
      //                 >
      //                   <Stack py={"24px"}>
      //                     <RadioGroup
      //                       onChange={(value) =>
      //                         form.setFieldValue(item.uuid, value, true)
      //                       }
      //                       value={form.values[field.name]}
      //                       name={item.uuid}
      //                     >
      //                       <Stack spacing={"24px"}>
      //                         {item.items.map((item, index) => (
      //                           <Radio
      //                             flexDirection={"row-reverse"}
      //                             colorScheme={"brand.blue"}
      //                             justifyContent={"space-between"}
      //                             key={index}
      //                             value={item.value}
      //                           >
      //                             {item.label}
      //                           </Radio>
      //                         ))}
      //                       </Stack>
      //                     </RadioGroup>
      //                   </Stack>
      //                 </CustomDropdown>
      //                 <FormErrorMessage>
      //                   {form.errors[field.name]}
      //                 </FormErrorMessage>
      //               </FormControl>
      //             )}
      //           </Field>
      //         ),
      //       }
      //     : {
      //         content: (
      //           <Field name={item.uuid} type={type}>
      //             {({ field, form }) => (
      //               <FormControl
      //                 isRequired={item.required}
      //                 isInvalid={
      //                   form.errors[field.name] && form.touched[field.name]
      //                 }
      //               >
      //                 <FormLabel
      //                   htmlFor={field.name}
      //                   fontSize="sm"
      //                   color="neutral.text.medium"
      //                   textTransform="capitalize"
      //                 >
      //                   {item.name}
      //                 </FormLabel>
      //                 <Input
      //                   variant="filled"
      //                   placeholder={"Isi " + item.name}
      //                   type={type}
      //                   {...field}
      //                 />
      //                 <FormErrorMessage>
      //                   {form.errors[field.name]}
      //                 </FormErrorMessage>
      //               </FormControl>
      //             )}
      //           </Field>
      //         ),
      //       }),
      // };
    });
  else return [];
}

export function createArrayPassanger(query) {
  const array = [];
  let j = 0;
  const pushArray = (item, array, type) => {
    for (let i = 0; i < item; i++) {
      array.push({ key: j, paxType: type, i: i });
      j++;
    }
  };

  pushArray(query.adult, array, "ADT");
  pushArray(query.child, array, "CHD");
  pushArray(query.infant, array, "INF");

  return array;
}

export function simplifyQuerySearch(query) {
  return {
    journeyDates: [
      {
        originCode: query.originCode,
        returnDate: query.returnDate,
        departureDate: query.departureDate,
        destinationCode: query.destinationCode,
      },
    ],
    adult: query.adult,
    child: query.child,
    infant: query.infant,
    airlines: query.airlines,
    class: query.class,
  };
}

export function simplifyJourneysFlight(journeys, query, isDomestic) {
  let payload = {}
  if(journeys?.IsConnecting === false){
    payload = {
      isInternational: `${!isDomestic}`,
      airline: journeys?.Airline,
      adult: query.adult,
      child: query.child,
      infant: query.infant,
      classId: journeys?.ClassObjects[0]?.Id,
      flightId: journeys?.ClassObjects[0]?.FlightId,
      fare: journeys?.ClassObjects[0]?.Fare,
      tax: journeys?.ClassObjects[0]?.Tax,
      fareBasisCode: journeys?.ClassObjects[0]?.FareBasisCode,
      code: journeys?.ClassObjects[0]?.Code,
      extraData: journeys?.ClassObjects[0]?.ExtraData
    };
  } else {
    const classId = []
    const flightId = []
    const tax = []
    const fare = []
    const code = []
    
    journeys?.ConnectingFlights.map(async (item) => {
      classId.push(item?.ClassObjects[0]?.Id)
      flightId.push(item?.ClassObjects[0]?.FlightId)
      tax.push(item?.ClassObjects[0]?.Tax)
      fare.push(item?.ClassObjects[0]?.Fare)
      code.push(item?.ClassObjects[0]?.Code)
    })

    payload = {
      isInternational: `${!isDomestic}`,
      airline: journeys?.Airline,
      adult: query.adult,
      child: query.child,
      infant: query.infant,
      classId: classId.join('#'),
      flightId: flightId.join('#'),
      fare: parseInt(fare.reduce((total, num) => total + num, 0)),
      tax: parseInt(tax.reduce((total, num) => total + num, 0)),
      fareBasisCode: journeys?.ConnectingFlights[0]?.ClassObjects[0]?.FareBasisCode,
      code: code.join('#'),
      extraData: journeys?.ConnectingFlights[0]?.ClassObjects[0]?.ExtraData
    };
    
  }
  return payload;
}

export async function convertCurrencySGDtoIDR(value = 0) {
  try {
    const qs = require("qs");
    const query = qs.stringify({
      filters: {
        code: {
          $eq: "convertCurrencyAttraction",
        },
      },
      fields: "value",
    });
    const response = await axios.get(`${BASE_URL}/configs?${query}`);
    const currencyValue = response.data.data[0].attributes.value;
    return Promise.resolve(parseInt(value) / currencyValue);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export function convertDatefilterTour(month = null, year = null) {
  const index = indexMonth.find(
    (item) => item.name.toLowerCase() === month.toLowerCase()
  );
  return `${year}-${index.value}`;
}

export function convertDateToTimestamp(date) {
  const newDate = new Date(date);

  const timestamp = newDate.getTime();
  return timestamp;
}

export function getTourAirlineAvailable(tour) {
  const mapTour = tour.map((item) => {
    const departures = item.departures.map((departure) => {
      const airlines = departure.airlines.map((airline) => {
        return { code: airline.code, name: airline.name };
      });
      return airlines;
    });
    return departures;
  });

  const uniqueAirline = uniqBy(mapTour.flat(3), "code");

  return uniqueAirline;
}

export function stringSplit(str, delimiter) {
  return str.split(delimiter);
}

export function mappingDetailPrice(traveler, price, promo = 0) {
  let resultTotalArray = [];
  let resultArray = [];
  let total = 0;
  let totalDownPayment = 0;
  let totalDiscount = 0;

  if (traveler?.adult) {
    if (traveler?.adult === 1) {
      resultArray.push({
        t: `Dewasa - Single (x1)`,
        p: `${convertRupiah(price?.adultSingle?.price)}`,
      });
      total += price?.adultSingle?.price;
      totalDiscount += price.adultSingle?.discount;
    } else if (traveler?.adult % 2 == 0) {
      resultArray.push({
        t: `Dewasa - Twin Share (x${traveler?.adult})`,
        p: `${convertRupiah(price?.adultTwinSharing?.price * traveler?.adult)}`,
      });
      total += price?.adultTwinSharing?.price * traveler?.adult;
      totalDiscount += price.adultTwinSharing?.discount * traveler?.adult;
    } else {
      resultArray.push({
        t: `Dewasa - Twin Share (x${traveler?.adult - 1})`,
        p: `${convertRupiah(
          price?.adultTwinSharing?.price * (traveler?.adult - 1)
        )}`,
      });
      resultArray.push({
        t: `Dewasa - Single (x1)`,
        p: `${convertRupiah(price?.adultSingle?.price)}`,
      });
      total += price?.adultTwinSharing?.price * (traveler?.adult - 1);
      total += price?.adultSingle?.price;
      totalDiscount += price.adultTwinSharing?.discount * (traveler?.adult - 1);
      totalDiscount += price.adultSingle?.discount;
    }
    totalDownPayment += price?.downPayment?.price * traveler?.adult;
  }

  if (traveler?.child) {
    if (traveler?.child % 2 == 0) {
      resultArray.push({
        t: `Anak-anak - Twin Share (x${traveler?.child})`,
        p: `${convertRupiah(price.childTwinSharing?.price * traveler?.child)}`,
      });
      total += price.childTwinSharing?.price * traveler?.child;
      totalDiscount += price.childTwinSharing?.discount * traveler?.child;
    } else if (traveler?.child > 1) {
      resultArray.push({
        t: `Anak-anak - Twin Share (x${traveler?.child - 1})`,
        p: `${convertRupiah(
          price.childTwinSharing?.price * (traveler?.child - 1)
        )}`,
      });
      resultArray.push({
        t: `Anak-anak - No Bed (x1)`,
        p: `${convertRupiah(price.childNoBed?.price)}`,
      });
      total += price.childTwinSharing?.price * (traveler?.child - 1);
      total += price.childNoBed?.price;
      totalDiscount += price.childTwinSharing?.discount * (traveler?.child - 1);
      totalDiscount += price.childNoBed?.discount;
    } else {
      resultArray.push({
        t: `Anak-anak - No Bed (x${traveler?.child})`,
        p: `${convertRupiah(price.childNoBed?.price)}`,
      });
      total += price.childNoBed?.price;
      totalDiscount += price.childNoBed?.discount;
    }
    totalDownPayment += price.downPayment?.price * traveler?.child;
  }

  //count total
  total = total - totalDiscount;

  if (price?.vatPercent > 0) {
    resultArray.push({
      t: `Pajak (${price.vatPercent}%)`,
      p: `${convertRupiah(percentage(total, price.vatPercent))}`,
    });
    total += percentage(total, price.vatPercent);
  }
  // console.log();

  if (price?.airportTaxAndFuel?.price > 0) {
    resultArray.push({
      t: `Airport Tax (x${(traveler?.child ?? 0) + (traveler?.adult ?? 0)})`,
      p: `${convertRupiah(
        price?.airportTaxAndFuel?.price *
          ((traveler?.child ?? 0) + (traveler?.adult ?? 0))
      )}`,
    });
    total +=
      price?.airportTaxAndFuel?.price *
      ((traveler?.child ?? 0) + (traveler?.adult ?? 0));
  }

  if (price.swab !== null) {
    resultArray.push({ t: `Swab`, p: `${convertRupiah(price.swab)}` });
    total += price.swab;
  }
  if (price.visa?.price > 0) {
    resultArray.push({
      t: `Visa (x${(traveler?.child ?? 0) + (traveler?.adult ?? 0)})`,
      p: `${convertRupiah(
        price.visa?.price * ((traveler?.child ?? 0) + (traveler?.adult ?? 0))
      )}`,
    });
    total +=
      price.visa?.price * ((traveler?.child ?? 0) + (traveler?.adult ?? 0));
  }
  resultTotalArray.push([
    {
      t: "Total Biaya",
      p: `${convertRupiah(total)}`,
      b: true,
    },
    {
      t: "Diskon (KODE PROMO)",
      p: `${promo ? convertRupiah(promo) : "Tidak ada"}`,
      b: promo ? true : false,
      g: promo ? true : false,
      h: promo ? false : true,
    },
  ]);
  resultTotalArray.push([
    {
      t: `Deposit (per-orang)`,
      p: `${convertRupiah(price?.downPayment?.price)}`,
      b: true,
    },
    {
      t: `Total Deposit (x${traveler?.child + traveler?.adult} Tamu)`,
      p: `${convertRupiah(totalDownPayment)}`,
      b: true,
    },
  ]);
  resultTotalArray.push([
    {
      t: `Sisa Biaya`,
      p: `${convertRupiah(total - totalDownPayment - promo)}`,
      b: false,
    },
    {
      t: `Sisa biaya maksimal dibayarkan 2 minggu sebelum keberangkatan`,
      p: ``,
      b: ``,
    },
  ]);

  resultTotalArray.unshift(resultArray);

  return resultTotalArray;
}

export function mappingRooms(traveler, price) {
  let resultArray = [];

  if (traveler?.adult) {
    if (traveler?.adult % 2 == 0) {
      resultArray.push({
        type: "adultTwinSharing",
        price: `${price.adultTwinSharing?.price}`,
        quantity: `${traveler?.adult}`,
      });
    } else {
      resultArray.push({
        type: "adultTwinSharing",
        price: `${price.adultTwinSharing?.price}`,
        quantity: `${traveler?.adult}`,
      });
      resultArray.push({
        type: "adultSingle",
        price: `${price.adultSingle?.price}`,
        quantity: 1,
      });
    }
  }

  if (traveler?.child) {
    if (traveler?.child % 2 == 0) {
      resultArray.push({
        type: "childTwinSharing",
        price: `${price.childTwinSharing?.price}`,
        quantity: `${traveler?.child}`,
      });
    } else if (traveler?.child > 1) {
      resultArray.push({
        type: "childTwinSharing",
        price: `${price.childTwinSharing?.price}`,
        quantity: `${traveler?.child - 1}`,
      });
      resultArray.push({
        type: "childNoBed",
        price: `${price.childNoBed?.price}`,
        quantity: 1,
      });
    } else {
      resultArray.push({
        type: "childNoBed",
        price: `${price.childNoBed?.price}`,
        quantity: 1,
      });
    }
  }

  return resultArray;
}

export function totalPriceTour(traveler, price) {
  let total = 0;
  let totalDiscount = 0;
  let totalDownPayment = 0;
  if (traveler?.adult) {
    if (traveler?.adult === 1) {
      total += price.adultSingle?.price;
      totalDiscount += price.adultSingle?.discount;
    } else if (traveler?.adult % 2 == 0) {
      total += price.adultTwinSharing?.price * traveler?.adult;
      totalDiscount += price.adultTwinSharing?.discount * traveler?.adult;
    } else {
      total += price.adultTwinSharing?.price * (traveler?.adult - 1);
      total += price.adultSingle?.price;
      totalDiscount += price.adultTwinSharing?.discount * (traveler?.adult - 1);
      totalDiscount += price.adultSingle?.discount;
    }
    totalDownPayment += price.downPayment?.price * traveler?.adult;
  }

  if (traveler?.child) {
    if (traveler?.child % 2 == 0) {
      total += price.childTwinSharing?.price * traveler?.child;
      totalDiscount += price.childTwinSharing?.discount * traveler?.child;
    } else if (traveler?.child > 1) {
      total += price.childTwinSharing?.price * (traveler?.child - 1);
      total += price.childNoBed?.price;
      totalDiscount += price.childTwinSharing?.discount * (traveler?.child - 1);
      totalDiscount += price.childNoBed?.discount;
    } else {
      total += price.childNoBed?.price;
      totalDiscount += price.childNoBed?.discount;
    }
    totalDownPayment += price.downPayment?.price * traveler?.child;
  }

  //count total
  total = total - totalDiscount;

  if (price?.vatPercent > 0) {
    total += percentage(total, price.vatPercent);
  }

  if (price.swab !== null) {
    total += price.swab;
  }
  if (price.visa?.price > 0) {
    total +=
      price.visa?.price * ((traveler?.child ?? 0) + (traveler?.adult ?? 0));
  }
  if (price?.airportTaxAndFuel?.price > 0) {
    total +=
      price.airportTaxAndFuel?.price *
      ((traveler?.child ?? 0) + (traveler?.adult ?? 0));
  }

  return {
    total: total,
    totalDiscount: totalDiscount,
    totalDownPayment: totalDownPayment,
  };
}

export const toTitleCase = (s) => {
  if (!s) return s;
  return s
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
    .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase()); // First char after each -/_
};

export function mappingPriceFlight(price, isSUMCombine = false) {
  const _ = require("lodash-core");
  if (isSUMCombine) {
    let results = [];
    price.map((item) => {
      const result = _(item.fares[0]?.paxFares)
        .groupBy((o) => o.paxType)
        .map((array, paxType) => ({
          paxType,
          quantity: array.length,
          totalBaseFare: sumBy(array, "baseFare"),
          discount: sumBy(array, "priceDiscount"),
          tax: sumBy(array, (fare) => sumBy(fare.taxFares, "taxFare")),
        }))
        .value();
      results.push(result);
    });
    return results.reduce((a, b) => {
      return a.map((item, i) => {
        return {
          ...item,
          quantity: item.quantity + b[i].quantity,
          totalBaseFare: item.totalBaseFare + b[i].totalBaseFare,
          discount: item.discount + b[i].discount,
          tax: item.tax + b[i].tax,
        };
      });
    });
  } else {
    const result = _(price)
      .groupBy((o) => o.paxType)
      .map((array, paxType) => ({
        paxType,
        quantity: array.length,
        totalBaseFare: sumBy(array, "baseFare"),
        discount: sumBy(array, "priceDiscount"),
        tax: sumBy(array, (fare) => sumBy(fare.taxFares, "taxFare")),
      }))
      .value();
    return result;
  }
}

export function differenceTimestamp(start, end) {
  const date1 = new Date(start);
  const date2 = new Date(end);
  const diff = date2 - date1;
  return diff;
}

export function sumPriceFare(segments, type = "DIRECT") {
  let totalPrice = 0;
  for (let i = 0; i < segments.length; i++) {
    totalPrice += segments[i].farePerPax?.priceFinalCustom ?? 0;
  }
  if (type == "THROUGH") {
    totalPrice = segments[0].farePerPax.priceFinalCustom ?? 0;
  }

  return totalPrice;
}

export function sumPriceFareFinal(segments, type = "DIRECT") {
  let totalPrice = 0;
  for (const segment of segments) {
    totalPrice +=
      (segment.farePerPax?.totalFare ?? 0) -
      (segment.farePerPax?.priceDiscount ?? 0);
  }
  if (type == "THROUGH") {
    totalPrice =
      (segments[0].farePerPax?.totalFare ?? 0) -
      (segments[0].farePerPax?.priceDiscount ?? 0);
  }
  return totalPrice;
}

export function percentage(num, per) {
  return parseInt(((num / 100) * per).toFixed(0));
}

export function camelCase(string = String) {
  return string.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function filterIsDomestic(flight) {
  const result = find(flight, ["isDomestic", false]);
  if (result) return false;
  return true;
}

export function travelerType(traveler) {
  return traveler === "ADT"
    ? "Dewasa"
    : traveler === "CHD"
    ? "Anak"
    : traveler === "INF"
    ? "Bayi"
    : "";
}

export function getPaxTypeName(traveler) {
  return traveler === "ADT"
    ? "Dewasa"
    : traveler === "CHD"
    ? "Anak"
    : traveler === "INF"
    ? "Bayi"
    : "";
}

export function getPaxTextCount(travelers) {
  let adult = 0;
  let child = 0;
  let infant = 0;
  travelers.forEach((item) => {
    if (item.paxType === "ADT") adult++;
    if (item.paxType === "CHD") child++;
    if (item.paxType === "INF") infant++;
  });
  let text = "";
  if (adult > 0) text += `${adult} Dewasa`;
  if (child > 0) text += `, ${child} Anak-anak`;
  if (infant > 0) text += `, ${infant} Bayi`;

  return text;
}

export function convertTypeToNameRoom(rooms) {
  return rooms.map((item) => {
    switch (item.type) {
      case "adultTwinSharing":
        return {
          ...item,
          name: "Dewasa - Twin Share",
        };
      case "childTwinSharing":
        return {
          ...item,
          name: "Anak-anak - Twin Share",
        };
      case "childTwinSharing?":
        return {
          ...item,
          name: "Anak-anak - Twin Share",
        };
      case "adultSingleRoom":
        return {
          ...item,
          name: "Dewasa - Single Supplement",
        };
      case "childNoBed":
        return {
          ...item,
          name: "Anak-anak - No Bed",
        };
      default:
        return item;
    }
  });
}

export function numberToDigits(number, digit) {
  return number.toString().padStart(digit, "0");
}

export function formatCardNumber(number) {
  const inputVal = number.replace(/ /g, ""); //remove all the empty spaces in the input
  let inputNumbersOnly = inputVal.replace(/\D/g, ""); // Get only digits
  if (inputNumbersOnly.length > 16) {
    //If entered value has a length greater than 16 then take only the first 16 digits
    inputNumbersOnly = inputNumbersOnly.substr(0, 16);
  }
  // Get nd array of 4 digits per an element EX: ["4242", "4242", ...]
  const splits = inputNumbersOnly.match(/.{1,4}/g);
  let spacedNumber = "";
  if (splits) {
    spacedNumber = splits.join(" "); // Join all the splits with an empty space
  }
  return spacedNumber;
}

export function formatCardExpiry(expiry) {
  const inputVal = expiry.replace(/ /g, ""); //remove all the empty spaces in the input
  let inputNumbersOnly = inputVal.replace(/\D/g, ""); // Get only digits
  if (inputNumbersOnly.length > 4) {
    //If entered value has a length greater than 4 then take only the first 4 digits
    inputNumbersOnly = inputNumbersOnly.substr(0, 4);
  }
  // Get nd array of 2 digits per an element EX: ["12", "24", ...]
  const splits = inputNumbersOnly.match(/.{1,2}/g);
  let spacedNumber = "";
  if (splits) {
    spacedNumber = splits.join(" / "); // Join all the splits with an empty space
  }
  return spacedNumber;
}

export function formatCardCVC(cvc) {
  const inputVal = cvc.replace(/ /g, ""); //remove all the empty spaces in the input
  let inputNumbersOnly = inputVal.replace(/\D/g, ""); // Get only digits
  if (inputNumbersOnly.length > 4) {
    //If entered value has a length greater than 3 then take only the first 3 digits
    inputNumbersOnly = inputNumbersOnly.substr(0, 4);
  }
  return inputNumbersOnly;
}

export function formatSecretCardNumber(number, hide) {
  const inputVal = number.replace(/ /g, ""); //remove all the empty spaces in the input
  let inputNumbersOnly = inputVal.replace(/\D/g, ""); // Get only digits
  if (inputNumbersOnly.length > 16) {
    //If entered value has a length greater than 16 then take only the first 16 digits
    inputNumbersOnly = inputNumbersOnly.substr(0, 16);
  }
  // Get nd array of 4 digits per an element EX: ["4242", "4242", ...]
  const splits = inputNumbersOnly.match(/.{1,4}/g);
  let spacedNumber = "";
  if (splits) {
    spacedNumber = splits.join(" "); // Join all the splits with an empty space
  }
  if (!hide) {
    const split = spacedNumber.split(" ");
    if (split.length > 1) {
      spacedNumber = `${split[0]} ${split[1].replace(
        /\d/g,
        "X"
      )} ${split[2].replace(/\d/g, "X")} ${split[3]}`;
    }
  }
  return spacedNumber;
}

export function mappingDetailPriceAttraction(
  participants,
  ticketDetail,
  productTypes,
  promo = 0
) {
  // console.log({ participants, ticketDetail, productTypes, promo });
  const { serviceFee } = ticketDetail;
  const eachPrice = _.mapObject(participants, (quantity, type) => {
    let item;
    switch (type) {
      case "adults":
        item = "adult";
        break;
      case "children":
        item = "child";
        break;
      case "youth":
        item = "youth";
        break;
      case "infants":
        item = "infant";
        break;
      case "seniors":
        item = "senior";
        break;

      default:
        break;
    }
    const pricePerPax = quantity * ticketDetail.prices[type][0].toFixed();
    const paxMarkup = productTypes[`${item}RecommendedMarkup`];
    let total;
    if (paxMarkup > 100) {
      total = pricePerPax + paxMarkup;
    }
    if (paxMarkup < 100) {
      total = pricePerPax + percentage(pricePerPax, paxMarkup);
    }
    if (quantity === 0) total = 0;
    let GateRatePrice;
    GateRatePrice = productTypes[`${item}GateRatePrice`] * quantity;
    if (quantity === 0) GateRatePrice = 0;
    const parseTotal = total > GateRatePrice ? total : GateRatePrice;
    return parseTotal;
  });
  let total = _.values(eachPrice).reduce((prev, val) => {
    return prev + val;
  });
  const additionalServiceFee = serviceFee.isFixed
    ? serviceFee.value
    : (total * serviceFee.value) / 100;
  total = total - promo;
  // const adultPrice =
  // (participants.adults || 0) * ticketDetail.prices.adults?.[0];
  // const childPrice =
  // (participants.children || 0) * ticketDetail.prices.children?.[0];
  // const total = adultPrice + childPrice - (promo ?? 0);
  let arrayParticipant = [];
  let arrayPrice = [
    {
      t: "Diskon (Kode Promo)",
      p: `${promo ? `- ${convertRupiah(promo)}` : "Tidak ada"}`,
      b: promo ? true : false,
      g: promo ? true : false,
      h: promo ? false : true,
    },
    {
      t: `Harga yang Anda Bayar`,
      p: (total + additionalServiceFee).toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      }),
      b: true,
    },
  ];
  let arrayResult = [];
  // if (participants?.adults > 0) {
  //   arrayParticipant.push({
  //     quantity: parseInt(participants.adults),
  //     t: `Dewasa (${participants.adults}x)`,
  //     p: adultPrice.toLocaleString("id-ID", {
  //       maximumFractionDigits: 0,
  //     }),
  //   });
  // }

  // if (participants?.children > 0) {
  //   arrayParticipant.push({
  //     quantity: parseInt(participants.children),
  //     t: `Anak-anak (${participants.children}x)`,
  //     p: childPrice.toLocaleString("id-ID", {
  //       maximumFractionDigits: 0,
  //     }),
  //   });
  // }
  _.keys(participants).map((item) => {
    arrayParticipant.push({
      t: `${toTitleCase(item)} (x${participants[item]})`,
      p: convertToRupiah(eachPrice[item].toFixed()),
    });
  });

  if (additionalServiceFee) {
    arrayParticipant.push({
      t: `Biaya Layanan`,
      p: additionalServiceFee.toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      }),
    });
  }

  arrayParticipant.push({
    t: `Pajak (1%)`,
    p: "Sudah Termasuk",
  });

  arrayResult.push(arrayParticipant);
  arrayResult.push(arrayPrice);

  return arrayResult;
}

export function mappingDetailPriceDeposit(traveler, price, promo = 0) {
  let resultTotalArray = [];
  let totalParticipant =
    parseInt(traveler.children) + parseInt(traveler.adults);
  resultTotalArray.push([
    {
      t: `Deposit (per-orang)`,
      p: `${convertRupiah(price / totalParticipant)}`,
      b: true,
    },
    {
      t: "Diskon (KODE PROMO)",
      p: `${promo ? convertRupiah(promo) : "Tidak ada"}`,
      b: promo ? true : false,
      g: promo ? true : false,
      h: promo ? false : true,
    },
    {
      t: `Total Deposit (x${totalParticipant})`,
      p: `${convertRupiah(price)}`,
      b: true,
    },
  ]);

  return resultTotalArray;
}

export const getCountryName = (countryCode) => {
  const country = countries.find((c) => c.code === countryCode);
  return country.name;
};

export const getLogoUrlByBankCode = (bankCode) => {
  const bankCodes = {
    "002": "BRI_52e2b90eaa.png",
    "008": "Mandiri_5089699e05.png",
    "011": "Danamon_db44832cb7.png",
    "013": "Permata_Bank_e7e5001168.png",
    "014": "BCA_146191550f.png",
    "016": "BII_Maybank_cecfa9285e.png",
    "022": "CIMB_91675525ba.png",
  };
  return bankCodes[bankCode]
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${bankCodes[bankCode]}`
    : "";
};

export const checkIsPromoAvailable = (slug) => {
  const isSpesificPromo = tourPromo.some((item) => item === slug);
  return isSpesificPromo;
};

export const getRangeDays = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  let diff = end.diff(start, "days");
  let range = [];
  for (let i = 0; i <= diff; i++) {
    range.push(start.clone().add(i, "days").format("YYYY-MM-DD"));
  }
  return range.length;
};

export const getMealString = (meal) => {
  const mealString = {
    breakfast: "Sarapan",
    lunch: "Makan Siang",
    dinner: "Makan Malam",
  };

  const includedMeals = Object.keys(meal).filter((key) => meal[key]);
  if (includedMeals.length === 0) return "Tidak Termasuk Makanan";
  return `Sudah Termasuk ${includedMeals
    .map((meal) => mealString[meal])
    .join(", ")}`;
};

export const mapToWishListCard = (data, type, slug) => {
  const urlImg = process.env.NEXT_PUBLIC_URL_IMAGES;
  switch (type) {
    case "tour": {
      return {
        slug,
        image: data.pictures[0].url,
        title: data.name,
        tags: data.tags.map((tag) => tag.items[0].name),
        details: [
          {
            icon: "weather",
            text: `${data.departures[0].duration} Hari`,
          },
          {
            icon: "airline",
            text: data.departures[0].airlines[0].name,
          },
        ],
        startingPrice: data.departures[0].startingPrice,
      };
    }
    case "hotel": {
      return {
        slug,
        image: `${urlImg}/original/${data?.hotel?.images[0].path}`,
        title: data?.hotel?.name?.content,
        subtitle: `${data?.hotel?.address?.street}, ${data?.hotel?.zone?.name} ${data?.hotel?.postalCode}`,
        startingPrice: data?.price,
      };
    }
    case "cruise": {
      return {
        slug,
        image: `${process.env.NEXT_PUBLIC_BACKEND_URL}${data?.pictures[0].url}`,
        title: data?.title,
        details: [
          {
            icon: "weather",
            text: `${data?.departures[0].duration} Hari`,
          },
          {
            icon: "ship",
            text: data?.ship,
          },
        ],
        startingPrice: data?.departures[0].startingPrice,
      };
    }
    case "package": {
      return {
        slug,
        image: `${process.env.NEXT_PUBLIC_BACKEND_URL}${data?.pictures[0].url}`,
        title: data?.title,
        details: [
          {
            icon: "weather",
            text: `${data?.departures[0].duration} Hari`,
          },
          {
            icon: "luggage",
            text: `${data?.departures.length} Keberangkatan`,
          },
        ],
        startingPrice: data?.startingPrice,
      };
    }
    case "attraction": {
      return {
        slug,
        image: `${data.photosUrl}${data.photos[0].paths["1280x720"]}`,
        title: data.title,
        details: [
          {
            icon: "star",
            text:
              data?.reviewAverageScore === 0
                ? "No Rating"
                : `Rating ${data?.reviewAverageScore}`,
          },
          {
            icon: "tag",
            text: data?.typeName || "Type Name",
          },
        ],
      };
    }
  }
};
