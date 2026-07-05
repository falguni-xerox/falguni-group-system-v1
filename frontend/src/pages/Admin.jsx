import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Tea",
    price: "",
    image: "",
    available: true,
    parcelAvailable: false,
    sortOrder: 0,
  });

  const [editingId, setEditingId] = useState(null);

  const categories = [
    "Tea",
    "Coffee",
    "Maggi",
    "Korean Maggi",
    "Cold Drinks",
  ];

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();

    if (data.success) {
      setProducts(data.products);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch(`${API_URL}/api/upload/image`, {
        method: "POST",
        body: imageData,
      });

      const data = await res.json();

      if (data.success) {
        setForm({
          ...form,
          image: data.imageUrl,
        });
        alert("Image uploaded successfully");
      } else {
        alert(data.message || "Image upload failed");
      }
    } catch (error) {
      alert("Image upload error");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "Tea",
      price: "",
      image: "",
      available: true,
      parcelAvailable: false,
      sortOrder: 0,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
    };

    const url = editingId
      ? `${API_URL}/api/products/${editingId}`
      : `${API_URL}/api/products`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert(editingId ? "Product updated" : "Product added");
      resetForm();
      fetchProducts();
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image || "",
      available: product.available,
      parcelAvailable: product.parcelAvailable,
      sortOrder: product.sortOrder || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Product deleted");
      fetchProducts();
    }
  };

  const toggleAvailable = async (product) => {
    const res = await fetch(`${API_URL}/api/products/${product._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        available: !product.available,
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchProducts();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {uploading && <p>Uploading image...</p>}

        {form.image && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={form.image}
              alt="Preview"
              width="100"
              height="100"
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        )}

        <input
          name="sortOrder"
          type="number"
          placeholder="Sort Order"
          value={form.sortOrder}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />
          Available
        </label>

        <label>
          <input
            type="checkbox"
            name="parcelAvailable"
            checked={form.parcelAvailable}
            onChange={handleChange}
          />
          Parcel Available
        </label>

        <button type="submit" disabled={uploading}>
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <hr />

      <h2>Product List</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Available</th>
            <th>Parcel</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    width="50"
                    height="50"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>

              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>Rs {product.price}</td>

              <td>
                <button onClick={() => toggleAvailable(product)}>
                  {product.available ? "Available" : "Not Available"}
                </button>
              </td>

              <td>{product.parcelAvailable ? "Yes" : "No"}</td>

              <td>
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;