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
