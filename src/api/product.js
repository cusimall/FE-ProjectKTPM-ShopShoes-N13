import axios from "../axiosConfig";

export const getAllProducts = () =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Calling getAllProducts API...');
      const response = await axios({
        url: "/api/products/all",
        method: "get",
      });
      console.log('getAllProducts response:', response);
      resolve(response);
    } catch (error) {
      console.error('getAllProducts error:', error);
      reject(error.message);
    }
  });

export const getProduct = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/products/${id}`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error.message);
    }
  });

export const addProduct = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.data) {
        throw new Error('Invalid data format');
      }

      console.log('Adding product with data:', JSON.stringify(data.data, null, 2));
      
      const response = await axios({
        url: `/api/products/add`,
        method: "post",
        data: data.data,
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      resolve(response);
    } catch (error) {
      console.error('Add product error:', error);
      reject(error.response?.data || error);
    }
  });

export const deleteProduct = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/products/${id}`,
        method: "delete",
      });
      resolve(response);
    } catch (error) {
      reject(error.message);
    }
  });

export const updateProduct = (id, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/products/${id}`,
        method: "put",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error.message);
    }
  });

export const getProductsPage = (page, size = 10) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Calling getProductsPage API...');
      const response = await axios({
        url: `/api/products/shop-products?page=${page}`,
        method: "get",
      });
      console.log('getProductsPage response:', response);
      resolve(response);
    } catch (error) {
      console.error('getProductsPage error:', error);
      reject(error.message);
    }
  });

export const importExcel = (file) =>
  new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios({
        url: '/api/products/import-excel',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error('Import Excel error:', error);
      reject(error.response?.data || error);
    }
  });