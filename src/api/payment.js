import axios from "../axiosConfig";

/**
 * Create a payment request using VNPAY
 */
export const createVnPayPayment = (amount) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/payments/vnpay/create/${amount}`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Get payment status by ID
 */
export const getPaymentStatus = (paymentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/payments/${paymentId}/status`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });