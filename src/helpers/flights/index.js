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

export function filterAirlines(flight, airlines, dataAirlines) {
    const flightNow = [] 
  
    const airlineTemp = airlines?.map((id) => {
        const airline = dataAirlines.find((data) => data.id === id.toString());
        return airline ? airline.name : '';
    })

    flight.map((item) => {
      if(item?.TotalTransit > 0){
        airlineTemp.map((air)=>{
          if(item?.ConnectingFlights[0]?.AirlineName === air){
            flightNow.push(item)
          }
        })
      } else {
        airlineTemp.map((air)=>{
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
    const filterTimeFlight = [
      { id: 1, time: ["00:00", "06:00"] },
      { id: 2, time: ["06:01", "12:00"] },
      { id: 3, time: ["12:01", "18:00"] },
      { id: 4, time: ["18:01", "24:00"] },
    ];

    const isArrivalTimeInRange = (flight, filterTime) => {
      if (!flight || !flight.ArriveTime) {
        return false;
      }
    
      // Ambil jam dan menit dari waktu kedatangan penerbangan
      const flightArriveTime = flight.ArriveTime.split(":");
      const flightHour = parseInt(flightArriveTime[0], 10);
      const flightMinute = parseInt(flightArriveTime[1], 10);
    
      // Bandingkan dengan waktu filter
      const filterStartTime = filterTime[0].split(":");
      const filterStartHour = parseInt(filterStartTime[0], 10);
      const filterStartMinute = parseInt(filterStartTime[1], 10);
    
      const filterEndTime = filterTime[1].split(":");
      const filterEndHour = parseInt(filterEndTime[0], 10);
      const filterEndMinute = parseInt(filterEndTime[1], 10);
    
      // Bandingkan waktu kedatangan dengan rentang waktu filter
      return (
        (flightHour > filterStartHour || (flightHour === filterStartHour && flightMinute >= filterStartMinute)) &&
        (flightHour < filterEndHour || (flightHour === filterEndHour && flightMinute <= filterEndMinute))
      );
    };

    const isDepartureTimeInRange = (flight, filterTime) => {
      if (!flight || !flight.DepartTime) {
        return false;
      }
    
      // Ambil jam dan menit dari waktu keberangkatan penerbangan
      const flightDepartTime = flight.DepartTime.split(":");
      const flightHour = parseInt(flightDepartTime[0], 10);
      const flightMinute = parseInt(flightDepartTime[1], 10);
    
      // Bandingkan dengan waktu filter
      const filterStartTime = filterTime[0].split(":");
      const filterStartHour = parseInt(filterStartTime[0], 10);
      const filterStartMinute = parseInt(filterStartTime[1], 10);
    
      const filterEndTime = filterTime[1].split(":");
      const filterEndHour = parseInt(filterEndTime[0], 10);
      const filterEndMinute = parseInt(filterEndTime[1], 10);
    
      // Bandingkan waktu keberangkatan dengan rentang waktu filter
      return (
        (flightHour > filterStartHour || (flightHour === filterStartHour && flightMinute >= filterStartMinute)) &&
        (flightHour < filterEndHour || (flightHour === filterEndHour && flightMinute <= filterEndMinute))
      );
    };

    let arrayResult = [];
    times.forEach((time) => {
      let filterTime = filterTimeFlight.find(item => item.id === parseInt(time)); // find(filterTimeFlight, { id: parseInt(time) });
      if (!filterTime) {
        console.error('filterTime not found for id:', time);
        return;
      }
      let data;
      if (type == "departure") {
        const dataTemp = flights.filter((item) => isDepartureTimeInRange(item, filterTime.time));
        data = orderBy(dataTemp, (item) => {
            return item?.DepartTime;
          },
        );
      } else if (type == "arrival") {
        const dataTemp = flights.filter((item) => isArrivalTimeInRange(item, filterTime.time));
        data = orderBy(dataTemp, (item) => {
          return item?.ArriveTime;
        },
      );
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

export function filterFlightType(flight, type, groupId, isRoundTrip, flightAirline, isSmartCombo){
    const flightNow = []
    
    if(isSmartCombo === 'true'){
      flight.map((item)=>{
        if(item?.FlightType === type && item?.GroupingId === groupId && item?.Airline === flightAirline){
          flightNow.push(item)
        }
      })
      return flightNow
    } else {
      flight.map((item)=>{
        if(item?.FlightType === type ){ // && item?.Airline === flightAirline
          flightNow.push(item)
        }
      })
      return flightNow
    }

  }