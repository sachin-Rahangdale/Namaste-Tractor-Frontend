import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, uploadProductImages } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AddProductForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    unit: "",
    phone: user?.phone || "",
    city: "",
    pincode: "",
    description: "",
    category: "MACHINERY",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First create product
      const productRes = await createProduct({
        ...formData,
        price: parseFloat(formData.price),
      });
      const productId = productRes.data.id;

      // Then upload images if any
      if (images.length > 0) {
        const formDataImg = new FormData();
        images.forEach(img => formDataImg.append("images", img));
        await uploadProductImages(productId, formDataImg);
      }

      alert("Product added successfully!");
      navigate("/my-products");
    } catch (err) {
      console.error(err);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Add Product for Sale</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Product Name *</label>
          <input type="text" name="productName" required value={formData.productName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Price (₹) *</label>
            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Unit *</label>
            <input type="text" name="unit" required placeholder="kg, quintal, piece, etc." value={formData.unit} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Phone (for contact) *</label>
          <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">City *</label>
            <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Pincode</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="MACHINERY">Machinery</option>
            <option value="CROP">Crop</option>
            <option value="VEGETABLE">Vegetable</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Product Images (first will be main)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full" />
          <p className="text-sm text-gray-500 mt-1">You can select multiple images. The first one will be the main image.</p>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">{loading ? "Adding..." : "Add Product"}</button>
      </form>
    </div>
  );
}