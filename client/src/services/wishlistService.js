import API from "./api";

export const addToWishlist = async (productId) => {
  const response = await API.post("/wishlist", {
    productId,
  });

  return response.data;
};

export const getWishlist = async () => {
  const response = await API.get("/wishlist");
  return response.data;
};

export const removeWishlistItem = async (wishlistId) => {
  const response = await API.delete(`/wishlist/${wishlistId}`);
  return response.data;
};