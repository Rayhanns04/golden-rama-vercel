import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const createWishList = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/whistlists`, data, {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getWishLists = async (custId, jwt) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/whistlists?filters[customer][id][$eq]=${custId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getWishListsByType = async (type, custId, jwt) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/whistlists?filters[customer][id][$eq]=${custId}&filters[type][$eq]=${type}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return Promise.resolve(response.data.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getWishListBySlug = async (slug, custId, jwt) => {
  try {
    const data = await getWishLists(custId, jwt);
    if (data.length === 0 || !data) return Promise.resolve(null);
    const wishList = data.find((item) => item.attributes.product.slug === slug);
    return Promise.resolve(wishList || null);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteWishList = async (data) => {
  try {
    const response = await axios.delete(`${BASE_URL}/whistlists/${data.id}`, {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
