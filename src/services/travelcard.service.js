import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_API;

export const getBalanceCard = async ({ cardNumber, jwt }) => {
    try {
        const response = await axios.post(`${BASE_URL}/orders/travelcard/balance`, {
            cardNumber: cardNumber,
        }, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const removeCard = async ({ cardNumber, jwt }) => {
    try {
        const response = await axios.post(`${BASE_URL}/orders/travelcard/remove`, {
            cardNumber: cardNumber,
        }, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const addCard = async (data) => {
    try {
        const payload = {
            cardNumber: data.card_number.replace(/\s/g, ''),
            pinCode: data.pinCode,
            phoneNumber: data.phone_number,
            password: data.password,
        }
        const response = await axios.post(`${BASE_URL}/orders/travelcard/verify`, payload, {
            headers: {
                'Authorization': `Bearer ${data.jwt}`
            }
        });
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const checkMinTopUp = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/travel-card`);
        return Promise.resolve(response.data.data.attributes);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const onReload = async (data) => {
    try {
        const payload = {
            customer: data.customer,
            journeys: {
                amount: data.amount,
                cardNumber: data.cardNumber,
            },
            transaction: {
                total: data.amount,
                subTotal: data.amount,
            }
        }
        const response = await axios.post(`${BASE_URL}/orders/travelcard/reload`, payload, {
            headers: {
                'Authorization': `Bearer ${data.jwt}`
            }
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getOrderDetail = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/orders/hotels/detail`, data);
        return Promise.resolve(response.data.data);
    } catch (error) {
        console.error(error);

        return Promise.reject(error);
    }
};