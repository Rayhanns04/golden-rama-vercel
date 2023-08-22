import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;
const LOCAL_URL = process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL_API;

export const getMe = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/customer-details/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const changePassword = async (token, data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/change-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateMe = async (token, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/customer-details/me`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
