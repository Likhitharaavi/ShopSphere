import API from "./api";

export const addToCart = async (productId, quantity = 1) => {
  const response = await API.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
};

export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

export const updateCartQuantity = async (cartId, quantity) => {
  const response = await API.put(`/cart/${cartId}`, {
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (cartId) => {
  const response = await API.delete(`/cart/${cartId}`);
  return response.data;
};