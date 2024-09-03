import { useState, useEffect } from 'react';
import { fetchCartContents, updateCart, removeFromCart } from '../api';
import { Link } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await fetchCartContents();
        

        if (response.data.status === 'success') {
          setCartItems(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch cart contents.');
        }
      } catch (error) {
        setError('Failed to fetch cart contents.');
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // Prevent setting quantity below 1

    try {
      const response = await updateCart(productId, quantity);
      if (response.data.status === 'success') {
        const updatedResponse = await fetchCartContents();
        if (updatedResponse.data.status === 'success') {
          setCartItems(updatedResponse.data.data); 
        } else {
          setError(updatedResponse.data.message || 'Failed to update cart.');
        }
      } else {
        setError(response.message || 'Failed to update cart.');
      }
    } catch (error) {
      setError('Failed to update cart.');
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await removeFromCart(productId);
      console.log(response);
      if (response.data.status === 'success') {

        const updatedResponse = await fetchCartContents();
        if (updatedResponse.data.status === 'success') {
          setCartItems(updatedResponse.data.data); // Update cart items after removal
        } else {
          setError(updatedResponse.data.message || 'Failed to remove item from cart.');
        }
      } else {
        setError(response.message || 'Failed to remove item from cart.');
      }
    } catch (error) {
      setError('Failed to remove item from cart.');
      console.error('Error removing from cart:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/" className="browse-link">Browse Products</Link></p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={`${item.product_id}-${index}`} className="cart-item">
              <img src={item.images || 'default-image-url.jpg'} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h2 className="cart-item-name">{item.name}</h2>
                <p className="cart-item-price">Price: ₹{item.price}</p>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.product_id, parseInt(e.target.value))}
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromCart(item.product_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
