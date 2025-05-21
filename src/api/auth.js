import axios from "../axiosConfig";

export const signIn = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/api/auth/signin",
        method: "post",
        data,
      });
      console.log('API SignIn full response:', response);
      
      // Store token and user info in localStorage upon successful login
      if (response.data) {
        const token = response.data.jwt || response.data.token || response.data.accessToken;
        console.log('Found token:', token);
        
        if (token) {
          // Clear any existing tokens first
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Store new token and user info
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log('Stored token:', token);
          
          // Set default authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          console.error('No token found in response:', response.data);
          reject(new Error('No token received from server'));
          return;
        }
      }
      resolve(response);
    } catch (error) {
      console.error('API SignIn error:', error);
      reject(error.response ? error.response : { status: 401 });
    }
  });

export const signUp = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/api/auth/signup",
        method: "post",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error.response ? error.response : { status: 401 });
    }
  });

// logout
export const logOut = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/api/auth/logout",
        method: "post",
      });
      // Remove token and user info from localStorage on logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      resolve(response);
    } catch (error) {
      // Still remove token and user info even if logout API fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      reject(error);
    }
  });