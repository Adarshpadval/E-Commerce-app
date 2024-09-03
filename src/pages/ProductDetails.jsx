import { useState, useEffect } from 'react';
import { fetchProductById, addToCart, fetchCartContents } from '../api';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetchProductById(productId);
        if (response.status === 'success') {
          setProduct(response.data);

          // Check if the product is already in the cart
          const cartResponse = await fetchCartContents();
          const productInCart = cartResponse.data.data.some(item => item.product_id === productId);
          setInCart(productInCart);
        } else {
          setError(response.message || 'Failed to fetch product details.');
        }
      } catch (error) {
        setError('Failed to fetch product details.');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (inCart) {
      setCartMessage('Product is already in the cart. Please check your cart.');
      return;
    }

    try {
      await addToCart(product.id, 1);
      setInCart(true);
      setCartMessage('Product added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setCartMessage('Failed to add product to cart.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="product-details">
      <div className="product-header">
        <div className="product-image-container">
          <Slider {...settings}>
            {product.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={product.name} className="product-image" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="product-info-container">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">Price: <span>₹{product.price}</span></p>
          <p className="product-description">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed earum sint, doloremque vitae aliquid qui laborum enim corrupti delectus similique ex placeat, dicta suscipit, quidem accusantium impedit repellendus rem inventore.</p>
          <div className="product-actions">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={inCart}
            >
              {inCart ? 'Already in Cart' : 'Add to Cart'}
            </button>
            {inCart && <p className="cart-message">Product is already in the cart. Please check your cart.</p>}
          </div>
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
