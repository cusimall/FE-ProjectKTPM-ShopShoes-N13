import axios from "../axiosConfig";

/**
 * Create a new invoice
 */
export const createInvoice = (invoiceData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/api/v1/invoices/create-from-cart",
        method: "post",
        data: invoiceData,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Get invoice by ID
 */
export const getInvoiceById = (invoiceId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/invoices/${invoiceId}`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Get invoices for current user
 */
export const getUserInvoices = () =>
  new Promise(async (resolve, reject) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id;
      
      if (!userId) {
        reject(new Error('User ID not found'));
        return;
      }

      const response = await axios({
        url: `/api/v1/invoices/user/${userId}`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Get all invoices (admin only)
 */
export const getAllInvoices = (page = 0, size = 10) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/invoices?page=${page}&size=${size}`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Update invoice status
 */
export const updateInvoiceStatus = (invoiceId, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      const requestData = {
        status,
        transactionId: null
      };

      console.log('Making API call to update invoice status:', {
        url: `/api/v1/invoices/${invoiceId}/status`,
        method: 'put',
        data: requestData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const response = await axios({
        url: `/api/v1/invoices/${invoiceId}/status`,
        method: "put",
        data: requestData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000, // 30s timeout
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Accept all responses to handle errors properly
        }
      });

      console.log('API response:', response);
      
      if (response.status === 200) {
        resolve(response);
      } else {
        reject(new Error(response.data?.message || 'Failed to update invoice status'));
      }
    } catch (error) {
      console.error('API error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        reject(error.response);
      } else if (error.request) {
        // The request was made but no response was received
        reject(new Error('No response received from server'));
      } else {
        // Something happened in setting up the request that triggered an Error
        reject(error);
      }
    }
  });

/**
 * Get invoices by status (admin only)
 */
export const getInvoicesByStatus = (status, page = 0, size = 10) =>
  new Promise(async (resolve, reject) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching invoices by status:', JSON.stringify({ 
        status, 
        page, 
        size, 
        hasToken: !!token,
        token: token ? token.substring(0, 20) + '...' : null 
      }, null, 2));
      
      const response = await axios({
        url: `/api/v1/invoices/status/${status}?page=${page}&size=${size}`,
        method: "get",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Raw API response:', JSON.stringify(response, null, 2));
      console.log('Invoices response data:', JSON.stringify({
        content: response.data?.content,
        totalPages: response.data?.totalPages,
        totalElements: response.data?.totalElements,
        size: response.data?.size,
        number: response.data?.number,
        rawData: response.data
      }, null, 2));
      
      resolve(response);
    } catch (error) {
      console.error('Error fetching invoices by status:', JSON.stringify({
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        error: error
      }, null, 2));
      reject(error.response ? error.response : error);
    }
  }); 