//ecommerce/frontend/src/hooks/useOrder.js
import { useState, useCallback } from "react";
import API from "../../api";

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      await API.delete(`/orders/${orderId}`);
      return true; // success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancelOrder, loading, error };
}
