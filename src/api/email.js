import axios from "../axiosConfig";

/**
 * Send an email
 */
export const sendEmail = (emailData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/api/email/send",
        method: "post",
        data: emailData,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Send order confirmation email
 */
export const sendOrderConfirmation = (orderId, emailData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/email/order-confirmation/${orderId}`,
        method: "post",
        data: emailData,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });
