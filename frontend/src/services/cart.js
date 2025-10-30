import api from "./api";

export const addToCart = async (product) => {
  const res = await api.post("/cart/add", {
    product_id: product._id,  
    name: product.name,
    price: product.price,
    image: product.image
  });
  window.dispatchEvent(new Event("cart-updated"));
  return res;
};

export const getCart = () => api.get("/cart");