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

/**
 * Create a COD (Cash On Delivery) payment
 */
export const createCodPayment = (orderId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/payments/cod/create`,
        method: "post",
        data: { orderId },
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });
