import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getAllMedias = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/articles?filters[type][$eq]=media`
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMedias = async (searchTerm = null, page, sort) => {
  try {
    let url = `${BASE_URL}/articles?populate=*&sort=${sort}:DESC&filters[type][$eq]=media&`;

    if (page) url += `pagination[page]=${page}&`;

    if (searchTerm) {
      url += `_q=${searchTerm}`;
    }
    const response = await axios.get(url);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMediaDetail = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/articles/${id}?populate=*`);
    return Promise.resolve(response.data.data.attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLatestMediaDetail = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/articles?populate=*&sort=createdAt:DESC&filters[type][$eq]=media&pagination[pageSize]=1`
    );
    return Promise.resolve(response.data.data[0].attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMediaDetailBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/articles?filters[slug][$eq]=${slug}&populate=*`
    );
    if (!response.data.data || response.data.data.length === 0)
      return Promise.reject({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    return Promise.resolve(response.data.data[0].attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};
