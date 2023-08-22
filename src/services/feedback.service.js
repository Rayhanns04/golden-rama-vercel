import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const sendFeedback = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/feedbacks`, { data });
    const captcha = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        secret: process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY,
        response: data.recaptcha,
      }
    );
    return Promise.resolve({ response: response.data, captcha: captcha.data });
  } catch (error) {
    return Promise.reject(error);
  }
};
