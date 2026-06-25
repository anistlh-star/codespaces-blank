// ecommerce/frontend/src/pages/UserPages/MyProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./MyProductDetail.css";
import API from "../../../api";
import { getImageSrc } from "../../components/imageHandler";

export default function MyProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        setError("Requested asset profile could not be compiled.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="ecom-detail-loader">Consolidating listing details...</div>;
  if (error || !product) {
    return (
      <div className="ecom-detail-error-screen">
        <p>{error || "Asset identity unresolved"}</p>
        <Link to="/my-products" className="ecom-detail-back-anchor">← Return to Inventory</Link>
      </div>
    );
  }

  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const mainImageSrc = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.images;

  return (
    <div className="ecom-detail-view-hub">
      <Link to="/my-products" className="ecom-detail-back-anchor">← Back to Inventory</Link>

      <div className="ecom-detail-split-grid">
        <div className="ecom-detail-media-gallery">
          <div className="ecom-detail-hero-frame">
            <img src={getImageSrc(mainImageSrc) || "https://placehold.co/600x600?text=No+Preview"} alt={product.name} />
          </div>

          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="ecom-detail-thumb-strip">
              {product.images.slice(1).map((img, index) => (
                <img key={index} src={getImageSrc(img)} alt={`Aspect ${index + 2}`} className="ecom-thumb-node" />
              ))}
            </div>
          )}
        </div>

        <div className="ecom-detail-metrics-panel">
          <div className="ecom-detail-meta-header">
           
            <span className="ecom-brand-tag">{product.brand || "Independent"}</span>
            <h1 className="ecom-product-title-heading">{product.name}</h1>
          </div>

          <div className="ecom-detail-pricing-tier">
            {product.salePrice && discount > 0 ? (
              <>
                <span className="ecom-price-active">${Number(product.salePrice).toFixed(2)}</span>
                <span className="ecom-price-struck">${Number(product.price).toFixed(2)}</span>
                <span className="ecom-badge-discount">-{discount}% Markdown</span>
              </>
            ) : (
              <span className="ecom-price-active">${Number(product.price).toFixed(2)}</span>
            )}
          </div>

          <div className="ecom-detail-fulfillment-row">
            <span className={`ecom-pill-status ${product.stockStatus || "in-stock"}`}>
              {product.stockStatus === "in-stock" ? "Active Listing" : "Depleted Stock"}
            </span>
            <span className="ecom-count-lbl">Allocated Units: <strong>{product.stock}</strong></span>
          </div>

          <div className="ecom-detail-narrative-box">
            <h3>Manifest Summary</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications?.length > 0 && (
            <div className="ecom-detail-specs-block">
              <h3>Technical Blueprint</h3>
              <div className="ecom-detail-specs-table">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="ecom-specs-row-node">
                    <span className="lbl-key">{spec.label}</span>
                    <span className="lbl-val">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}