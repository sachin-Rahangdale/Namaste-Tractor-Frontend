import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, updateProduct, uploadProductImages } from "../api";

export default function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    unit: "",
    phone: "",
    city: "",
    pincode: "",
    description: "",
    category: "MACHINERY",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const p = res.data;
        setFormData({
          productName: p.productName || "",
          price: p.price || "",
          unit: p.unit || "",
          phone: p.phone || "",
          city: p.city || "",
          pincode: p.pincode || "",
          description: p.description || "",
          category: p.category || "MACHINERY",
        });
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Update product details
      await updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
      });
      // Upload new images if any (backend will append, not replace)
      if (images.length > 0) {
        const formDataImg = new FormData();
        images.forEach(img => formDataImg.append("images", img));
        await uploadProductImages(id, formDataImg);
      }
      alert("Product updated successfully!");
      navigate("/my-products");
    } catch (err) {
      console.error(err);
      setError("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading product data...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
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
            <input type="text" name="unit" required placeholder="kg, quintal, piece" value={formData.unit} onChange={handleChange} className="w-full border rounded px-3 py-2" />
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
          <label className="block font-semibold mb-1">Add New Images (optional)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full" />
          <p className="text-sm text-gray-500 mt-1">New images will be added to existing ones.</p>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">{submitting ? "Updating..." : "Update Product"}</button>
          <Link to="/my-products" className="flex-1 text-center bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400">Cancel</Link>
        </div>
      </form>
    </div>
  );
}