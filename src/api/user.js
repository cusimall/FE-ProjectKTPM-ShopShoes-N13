import axios from "../axiosConfig";

export const fetchAllUser = (page, size = 10) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/users/all?page=${page}&size=${size}`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

// Add more user-related API calls as needed
export const getUserProfile = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/users/me`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });