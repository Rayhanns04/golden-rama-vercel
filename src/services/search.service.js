import axios from "axios";
import qs from "qs";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;
import _ from "lodash";

export const getFastSearch = async (search) => {
  try {
    const query = qs.stringify(
      {
        query: search,
      },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    const response = await axios.get(`${BASE_URL}/searchGlobal${query}`);
    const data = response.data.map((item) => {
      const navPath = "/svg/nav/";
      switch (item.type) {
        case "hotels":
          item.label = "Hotel";
          item.icon = navPath + "hotels.svg";
          break;
        case "attractions":
          item.label = "Atraksi dan Hiburan";
          item.icon = navPath + "attractions.svg";
          break;
        case "tours":
          item.label = "Tour";
          item.icon = navPath + "tours.svg";
          break;
        case "cruises":
          item.label = "Cruise";
          item.icon = navPath + "cruises.svg";
          break;
        case "articles":
          item.label = "Artikel";
          item.icon = navPath + "articles.svg";
          break;
        case "packages":
          item.label = "Paket";
          item.icon = navPath + "packages.svg";
          break;
        default:
          item.label = item.type;
          item.icon = navPath + item.type + ".svg";
          break;
      }
      return item;
    });
    const grouping = _.groupBy(data, "label");
    console.log(
      "🚀 ~ file: search.service.js:51 ~ getFastSearch ~ { data, grouping }",
      { data, grouping }
    );
    return Promise.resolve({ data, grouping });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
