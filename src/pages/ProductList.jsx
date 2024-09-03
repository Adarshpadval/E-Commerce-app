import { useState, useEffect } from 'react';
import { fetchProducts, fetchCartContents, addToCart } from '../api';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProductsAndCart = async () => {
      try {
        const [productsResponse, cartResponse] = await Promise.all([
          fetchProducts(),
          fetchCartContents(),
        ]);

        setProducts(productsResponse.data);
        setCartItems(cartResponse.data.data);
      } catch (error) {
        console.error('Error fetching products or cart:', error);
        setError('Failed to load products or cart.');
      } finally {
        setLoading(false);
      }
    };

    getProductsAndCart();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1); // Add 1 item to the cart
      alert('Product added to cart!');

      // After adding to cart, refetch the cart contents
      const cartResponse = await fetchCartContents();
      setCartItems(cartResponse.data.data);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.product_id === productId);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h1>Welcome to the Product Store</h1>
      <p>Browse through our wide range of products!</p>
      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-carousel">
                {product.images.length > 1 ? (
                  <Slider {...settings}>
                    {product.images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={product.name}
                          className="product-image"
                          loading="lazy"
                          onError={(e) => (e.target.src = 'path/to/placeholder-image.jpg')} // Placeholder image
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'path/to/placeholder-image.jpg')} // Placeholder image
                  />
                )}
              </div>
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">₹{product.price}</p>
              <div className="product-actions">
                <Link to={`/products/${product.id}`} className="product-link">
                  View Details
                </Link>
                {isProductInCart(product.id) ? (
                  <p className="in-cart-message">Product is in cart</p>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
