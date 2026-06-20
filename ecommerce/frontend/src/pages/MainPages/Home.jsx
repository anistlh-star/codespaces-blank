//ecommerce/frontend/src/pages/MainPages/Home.jsx
import { useEffect } from "react";
import { useState } from "react";
import API from "../../../api";
import { Link } from "react-router-dom";
const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await API.get("/products/all");
      setProducts(res.data.products);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>products List</h1>
      <p>
        <Link to={"/admin"}>admin</Link>
      </p>
      {products.map((p) => (
        <div key={p._id}>
          <p>{p.name}</p>
          <p>{p.price}</p>
        </div>
      ))}
    </div>
  );
};
export default Home;
