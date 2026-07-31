import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      console.log("API Response:", data);
      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="hero">
      <div className="container">
        <h1>ShopSphere</h1>

        <h2>Products</h2>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;