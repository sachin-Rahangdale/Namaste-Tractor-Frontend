import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createEnquiry } from "../api";

export default function EnquiryForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefillMessage = location.state?.prefillMessage || "";
  const prefillEnquiryType = location.state?.prefillEnquiryType || "";
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    enquiryType: prefillEnquiryType || "TRACTOR_PROBLEM",
    message: prefillMessage,
    pincode: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pre-fill name and phone if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const enquiryTypes = [
    { value: "TRACTOR_PROBLEM", label: "🚜 Tractor Problem / Repair" },
    { value: "PURCHASE_QUERY", label: "💰 Purchase Query (Tractor/Implement)" },
    { value: "PRODUCT_QUERY", label: "🌾 Product / Seed / Fertilizer Query" },
    { value: "FARMING_ADVICE", label: "🌱 Farming Advice / Crop Guidance" },
    { value: "GENERAL", label: "📞 General Enquiry" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await createEnquiry(formData);
      setSuccess("✅ Enquiry submitted successfully! Our team will contact you soon.");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Submission failed. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Farmer Enquiry</h1>
      <p className="text-gray-600 mb-6">
        Having trouble with your tractor? Need farming advice? Want to buy a product?  
        Fill out the form below – we’ll get back to you quickly.
      </p>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Enter 10-digit mobile number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Enquiry Type *</label>
          <select
            name="enquiryType"
            value={formData.enquiryType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {enquiryTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Message / Description *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe your issue or query in detail..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            pattern="[0-9]{6}"
            title="6-digit pincode"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Address (Village / Taluka / District)</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            placeholder="e.g., Village: Khapri, Taluka: Nagpur, District: Nagpur"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-2 rounded-lg font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}