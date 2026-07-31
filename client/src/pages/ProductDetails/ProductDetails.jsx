import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  const image =
    product.images?.length > 0 &&
    product.images[0].startsWith("/uploads")
      ? `http://localhost:5000${product.images[0]}`
      : "https://via.placeholder.com/400x400?text=No+Image";
  
  const handleAddToCart = async () => {
    try {
      const data = await addToCart(product._id);

      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };
  const handleAddToWishlist = async () => {
  try {
    const data = await addToWishlist(product._id);

    alert(data.message);
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to add to wishlist"
    );
  }
};
  return (
    <div
      className="container"
      style={{
        display: "flex",
        gap: "70px",
        padding: "60px",
        alignItems: "center",
      }}
    >
      <img
        src={image}
        alt={product.name}
        style={{
          width: "400px",
          height: "400px",
          objectFit: "cover",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        }}
      />

      <div>
        {product.featured && (
          <span
            style={{
              background: "gold",
              color: "#333",
              padding: "6px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
              display: "inline-block",
              marginBottom: "15px",
            }}
          >
            ⭐ Featured Product
          </span>
        )}

        <h1>{product.name}</h1>

        <h3 style={{ color: "#666" }}>{product.brand}</h3>

        <p>
          <strong>Category:</strong>{" "}
          {product.category?.name || "General"}
        </p>

        <p style={{ margin: "12px 0", fontSize: "18px" }}>
          ⭐ {product.rating} ({product.numReviews} Review
          {product.numReviews !== 1 ? "s" : ""})
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            margin: "20px 0",
          }}
        >
          <h2 style={{ color: "#2563eb" }}>
            ₹{product.discountPrice.toLocaleString()}
          </h2>

          <h3
            style={{
              textDecoration: "line-through",
              color: "#888",
            }}
          >
            ₹{product.price.toLocaleString()}
          </h3>

          <p
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            {Math.round(
              ((product.price - product.discountPrice) /
                product.price) *
                100
            )}
            % OFF
          </p>
        </div>

        <p
          style={{
            color: product.stock > 0 ? "green" : "red",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          Only <strong>{product.stock}</strong> items left
        </p>

        <p
          style={{
            marginBottom: "30px",
            fontSize: "17px",
            lineHeight: "28px",
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <button
            onClick={handleAddToCart}
            style={{
              width: "160px",
              height: "50px",
              background: "orange",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>

          <button
            onClick={handleAddToWishlist}
            style={{
              width: "160px",
              height: "50px",
              background: "#e11d48",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ❤ Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;