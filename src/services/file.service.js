import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  const response = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data[0];
};

export const uploadFiles = async (files) => {
  const promises = files.map((file) => {
    const formData = new FormData();
    formData.append("files", file);
    return axios.post(`${BASE_URL}/upload`, formData);
  });
  try {
    const responses = await Promise.all(promises);
    return Promise.resolve(responses.map((response) => response.data[0]));
  } catch (error) {
    return Promise.reject(error);
  }
};
