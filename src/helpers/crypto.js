import CryptoJS from "crypto-js";

const secret_key = process.env.NEXT_PUBLIC_SECRET_KEY || "secret_key";

export const encryptData = (data) => {
  const parsedkey = CryptoJS.enc.Utf8.parse(secret_key);
  const encrypted = CryptoJS.AES.encrypt(data, parsedkey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
