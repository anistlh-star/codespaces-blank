//ecommerce/frontend/src/hooks/useCategories.js
import { useEffect, useState } from "react";
import API from "../../api/index.js";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [productsPerCategory, setProductsPerCategory] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories/all");
        console.log('res categories : ' , res)
        setCategories(res.data.data.categories || []);
        setProductsPerCategory(res.data.data.productsPerCategory || []);
      } catch (error) {
        //console.log("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loadingCategories,
    productsPerCategory,
    setLoadingCategories,
  };
};
