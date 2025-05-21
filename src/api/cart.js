import axios from "../axiosConfig";

/**
 * Get the current user's cart
 */
export const getCart = () =>
  new Promise(async (resolve, reject) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        reject(new Error('User not logged in'));
        return;
      }
      const response = await axios({
        url: `/api/carts/user/${userId}`,
        method: "get",
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Add an item to the cart
 */
export const addToCart = (productData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/carts/add`,
        method: "post",
        data: productData,
        timeout: 30000,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Update cart item quantity
 */
export const updateCartItem = (cartItemId, quantity) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/carts/items/${cartItemId}`,
        method: "patch",
        params: { quantity },
        timeout: 30000,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Remove an item from the cart
 */
export const removeFromCart = (cartItemId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/carts/items/${cartItemId}`,
        method: "delete",
        timeout: 30000,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Clear the entire cart
 */
export const clearCart = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/api/v1/carts/clear",
        method: "delete",
        timeout: 30000,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });

/**
 * Checkout cart
 */
export const checkoutCart = (cartId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `/api/v1/carts/${cartId}/checkout`,
        method: "post",
        timeout: 30000,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : error);
    }
  });