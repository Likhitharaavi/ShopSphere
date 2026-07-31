import { useEffect, useState } from "react";
import {
  getCart,
  updateCartQuantity,
  removeCartItem,
} from "../../services/cartService";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data.cart);
    } catch (error) {
      console.error(error);
    }
  };

const handleQuantity = async (cartId, quantity) => {
  if (quantity < 1) return;

  try {
    await updateCartQuantity(cartId, quantity);
    fetchCart();
  } catch (error) {
    alert(error.response?.data?.message || "Failed to update quantity");
  }
};

  const handleRemove = async (cartId) => {
    try {
      await removeCartItem(cartId);
      alert("Item removed successfully");
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      (item.product.discountPrice || item.product.price) *
        item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <h2>Your Cart is Empty</h2>
      ) : (
        <>
          {cartItems.map((item) => {
            const image =
              item.product.images?.length > 0 &&
              item.product.images[0].startsWith("/uploads")
                ? `http://localhost:5000${item.product.images[0]}`
                : "https://via.placeholder.com/150";

            return (
              <div className="cart-item" key={item._id}>
                <img
                  src={image}
                  alt={item.product.name}
                  className="cart-image"
                />

                <div className="cart-details">
                  <h2>{item.product.name}</h2>

                  <p>
                    Price: ₹
                    {(
                      item.product.discountPrice ||
                      item.product.price
                    ).toLocaleString()}
                  </p>

                  <div className="cart-buttons">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantity(
                          item._id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span
                      style={{
                        padding: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.quantity}
                    </span>

                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantity(
                          item._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <p>
                    Subtotal: ₹
                    {(
                      (item.product.discountPrice ||
                        item.product.price) *
                      item.quantity
                    ).toLocaleString()}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cart-summary">
            <h2>
              Total: ₹{totalPrice.toLocaleString()}
            </h2>

            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;