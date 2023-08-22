import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getArticles = async ({ pageParam }) => {
  try {
    let url = `${BASE_URL}/articles?populate=*&sort=createdAt:DESC&filters[type][$eq]=article&`;

    if (pageParam)
      url += `pagination[pageSize]=6&pagination[page]=${pageParam}&`;

    const response = await axios.get(url);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getAllArticlesByType = async (type = "article") => {
  try {
    let url = `${BASE_URL}/articles?filters[type][$eq]=${type}`;
    const response = await axios.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

export const getArticleDetail = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/articles/${id}?populate=*`);
    return Promise.resolve(response.data.data.attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLatestArticleDetail = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/articles?populate=*&sort=createdAt:DESC&filters[type][$eq]=article&pagination[pageSize]=1`
    );
    return Promise.resolve(response.data.data[0].attributes);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getArticleDetailBySlug = async (slug) => {
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
