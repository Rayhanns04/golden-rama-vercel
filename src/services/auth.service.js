import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;
const LOCAL_URL = process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL_API;

export const loginForm = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/local`, data);
    if (response.data && response.data.jwt && response.data.user) {
      const jwt = jwt_decode(response.data.jwt)
      const userDetail = await axios.get(`${BASE_URL}/customer-details/me`, {
        headers: {
          Authorization: `Bearer ${response.data.jwt}`,
        },
      });
      const jwt_expiration = new Date(jwt.exp * 1000)
      const data = {
        jwt: response.data.jwt,
        jwt_expiration: jwt_expiration,
        user: {
          ...userDetail.data,
          confirmed: response.data.user.confirmed,
          isSubscribed: response.data.user.isSubscribed,
        }
      }
      // localStorage.setItem('auth', JSON.stringify({
      //     jwt: response.data.jwt,
      //     user: response.data.user,
      //     jwt_expiration: jwt_expiration
      // }))
      return Promise.resolve(data);
    }
    return await Promise.reject(false)
  } catch (error) {
    return error.response
  }
};

export const registerForm = async (value) => {
  try {
    const response = await axios.post(`${BASE_URL}/customer-details`, {
      data: {
        ...value,
        "username": value.email,
        "full_name": value.name,
        "phone": `0${value.phone}`,
      }
    });
    if (response.status !== 200) return Promise.reject(response);
    await axios.post(`${BASE_URL}/verifications/send`, {
      ...value,
      email: value.email,
      type: "registration"
    });

    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const forgotForm = async (value) => {
  try {
    const response = await axios.post(`${BASE_URL}/verifications/send`, {
      ...value,
      email: value.email,
      type: "reset"
    });
    if (response.status !== 200) return Promise.reject(response);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const verifyCode = async (value) => {
  try {
    const response = await axios.post(`${BASE_URL}/verifications/verify`, {
      ...value,
      email: value.email,
      code: value.code,
      type: value.type
    });
    if (response.status === 200 && value.type === "registration") {
      const login = await loginForm({
        identifier: value.email,
        password: response.data.data.password
      })
      return Promise.resolve(login);
    };
    if (response.status === 200 && value.type === "reset") {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
