// ecommerce/frontend/src/pages/MainPages/OtherPages/CategoryTabs.jsx
import "./CategoryTabs.css";

const CategoryTabs = ({ activeCategory, setActiveCategory, categories }) => {
  return (
    <div className="ecom-category-tabs-container">
      <div className="ecom-category-tabs-row">
        {/* Default Selection Anchor */}
        <button
          className={`ecom-category-tab-btn ${activeCategory === "All" ? "is-active" : ""}`}
          onClick={() => setActiveCategory("All")}
        >
          All
        </button>

        {/* Dynamic Category Mapping Stream */}
        {categories?.map((cat) => {
          const catName = cat.name || cat.categoryName || cat._id;
          return (
            <button
              key={cat._id || catName}
              className={`ecom-category-tab-btn ${activeCategory === catName ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat.name || cat.categoryName)}
            >
              {catName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;