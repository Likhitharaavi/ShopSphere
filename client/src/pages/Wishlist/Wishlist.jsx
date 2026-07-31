import { useEffect, useState } from "react";
import {
  getWishlist,
  removeWishlistItem,
} from "../../services/wishlistService";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data.wishlist);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeWishlistItem(id);
      alert("Item removed from wishlist");
      fetchWishlist();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cart-container">
      <h1>❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <h2>Your Wishlist is Empty</h2>
      ) : (
        wishlist.map((item) => {
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
                  ₹
                  {(
                    item.product.discountPrice ||
                    item.product.price
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
        })
      )}
    </div>
  );
}

export default Wishlist;