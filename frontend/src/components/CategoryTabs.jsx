import "../styles/category.css";
function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category}
          className={
            selectedCategory === category
              ? "category-btn active"
              : "category-btn"
          }
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;