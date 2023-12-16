import orderBy from "lodash/orderBy";
import compact from "lodash/compact";

const dataSortFlight = [
    "Harga Terendah",
    "Harga Tertinggi",
    "Keberangkatan Pagi",
    "Keberangkatan Malam",
    "Durasi Singkat",
    "Durasi Panjang",
];

export function convertTimeToCustomFormat(inputTime) {
    if (inputTime) {
      const [day, hours, minutes] = inputTime.split(':');  
      const formattedTime = `${day === "00" ? '' : `${parseInt(day)}h`} ${hours === "00" ? '' : `${parseInt(hours)}j`} ${minutes === "00" ? '' : `${parseInt(minutes)}m`}`;
      return formattedTime;
    } else {
      return "Format waktu tidak valid";
    }
}

export function sortFlight(sort, data) {
    const index = dataSortFlight.findIndex((e) => e === sort);
    let result;
    switch (index) {
      case 0:
        result = orderBy(data, (item) => {
          let totalFare = item?.Fare;
          return totalFare;
        });
        break;
      case 1:
        result = orderBy( data, (item) => {
            let totalFare = item.Fare;
            return totalFare;
          },
          "desc"
        );
        break;
      case 2:
        result = orderBy(data, (item) => {
          let date = new Date(item.DepartDateTime);
          return date.getTime();
        });
        break;
      case 3:
        result = orderBy(data, (item) => {
            let date = new Date(item.DepartDateTime);
            return date.getTime();
          },
          "desc"
        );
        break;
      case 4:
        result = orderBy(data, (item) => {
            return convertTotalDateTimeToMilliseconds(
              item?.TotalDateTime
            );
          },
        );
        break;
      case 5:
        result = orderBy(data, (item) => {
            return convertTotalDateTimeToMilliseconds(
              item?.TotalDateTime
            );
          },
          "desc"
        );
        break;
      default:
        break;
    }
          
    return result;
}

export function convertTotalDateTimeToMilliseconds(totalDateTime) {
    const [hours, minutes, seconds] = totalDateTime.split(":").map(Number);
    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    return totalMilliseconds;
}

export function filterAirlines(flight, airlines) {
    const flightNow = [] 
  
    flight.map((item) => {
      if(item?.TotalTransit > 0){
        airlines.map((air)=>{
          if(item?.ConnectingFlights[0]?.AirlineName === air){
            flightNow.push(item)
          }
        })
      } else {
        airlines.map((air)=>{
          if(item?.AirlineName === air){
            flightNow.push(item)
          }
        })
      }
       
    });
  
    return flightNow;
}

export function filterTransit(flight, transit) {
    const flightNow = []
  
    flight.map((item)=>{
      transit.map((trans)=>{
        if(item?.TotalTransit === Number(trans)){
          flightNow.push(item)
        }
      })
    })
    return flightNow;
}

export function filterOthers(flight) {
    const result = filter(flight, {
      segments: [{ fares: [{ isRefundable: true }] }],
    });
    return result;
}

export function filterFacility(flight) {
    const result = filter(flight, {
      segments: [{ additionalBaggageSupport: true }],
    });
    return result;
}

export function filterFlightDepartureAndArrival(flights, type, times) {
    let arrayResult = [];
    times.forEach((time) => {
      let filterTime = find(filterTimeFlight, { id: parseInt(time) });
      let data;
      if (type == "departure") {
        data = flights.map((item) => {
          let startTime = new Date(
            `${item?.DepartDateTime.slice(0, 10)} ${
              filterTime.time[0]
            }`
          );
          let endTime = new Date(
            `${item?.DepartDateTime.slice(0, 10)} ${
              filterTime.time[1]
            }`
          );
          let currentDate = new Date(item?.DepartDateTime);
          if (
            currentDate.getTime() >= startTime.getTime() &&
            currentDate.getTime() <= endTime.getTime()
          ) {
            return item;
          }
        });
      } else if (type == "arrival") {
        data = flights.map((item) => {
          let startTime = new Date(
            `${item?.ArriveDateTime.slice(
              0,
              10
            )} ${filterTime.time[0]}`
          );
          let endTime = new Date(
            `${item?.ArriveDateTime.slice(
              0,
              10
            )} ${filterTime.time[1]}`
          );
          let currentDate = new Date(
            item?.ArriveDateTime
          );
          if (
            currentDate.getTime() >= startTime.getTime() &&
            currentDate.getTime() <= endTime.getTime()
          ) {
            return item;
          }
        });
      }
      const result = compact(data);
      arrayResult = [...arrayResult, ...result];
    });
    return arrayResult;
}

export function filterPrice(flight, minPrice, maxPrice) {
    const flights = flight.map((item) => {
      const totalPrice = item?.Fare;
      if (totalPrice >= minPrice && totalPrice <= maxPrice) {
        return item;
      }
    });
    const result = compact(flights);
    return result;
}


export function filterFlightType(flight, type, groupId, isRoundTrip, flightAirline){
    const flightNow = []
    
    flight.map((item)=>{
      if(item?.FlightType === type && item?.GroupingId === groupId && item?.Airline === flightAirline){
        flightNow.push(item)
      }
    })
    return flightNow
  }