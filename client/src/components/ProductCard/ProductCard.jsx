import "./ProductCard.css";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const image =
    product.images && product.images.length > 0
      ? product.images[0].startsWith("/uploads")
        ? `http://localhost:5000${product.images[0]}`
        : "https://via.placeholder.com/260x220?text=No+Image"
      : "https://via.placeholder.com/260x220?text=No+Image";

  return (
    <div className="product-card">
      <img
        src={image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>

        <h3 className="product-name">{product.name}</h3>

        <p className="product-price">₹{product.price}</p>

        <div className="product-buttons">
          <button
            className="view-btn"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            View
          </button>

          <button className="cart-btn">Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;