import axios from 'axios';

const API_BASE_URL = 'http://localhost/shop_apis'; // For local development

// Product APIs
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetch_products.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw error to handle it in the component
  }
};

export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProduct.php`, {
      params: { id: productId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Cart APIs
export const fetchCartContents = () => axios.get(`${API_BASE_URL}/fetchCartContents.php`);
export const addToCart = (productId, quantity) => {return axios.post(`${API_BASE_URL}/addToCart.php`, { productId, quantity });};
export const updateCart = (productId, quantity) => axios.post(`${API_BASE_URL}/updateCart.php`, { productId, quantity });
export const removeFromCart = (productId) => axios.post(`${API_BASE_URL}/removeFromCart.php`, { productId });
