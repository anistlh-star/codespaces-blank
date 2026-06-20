//ecommerce/frontend/src/pages/MainPages/OtherPages/CategoryTabs.jsx
import "./CategoryTabs.css";

const CategoryTabs = ({ activeCategory, setActiveCategory, categories }) => {
  return (
    <div className="categoryTabs">
      <div className="categoryTabs__tabs">
        <button
          className={`categoryTabs__tab ${activeCategory === "All" ? "active" : ""}`}
          onClick={() => setActiveCategory("All")}
        >
          All
        </button>

        {categories?.map((cat) => {
          const catName = cat.name || cat.categoryName || cat._id;
          return (
            <button
              key={cat._id || catName}
              className={`categoryTabs__tab ${activeCategory === catName ? "active" : ""}`}
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
