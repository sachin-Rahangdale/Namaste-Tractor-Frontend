import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      <img 
        src={product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"} 
        alt={product.productName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl">{product.productName}</h3>
        <p className="text-gray-600">Unit: {product.unit}</p>
        <p className="text-gray-600">City: {product.city}</p>
        <p className="text-green-700 font-bold mt-2">₹{product.price.toLocaleString()}</p>
        <Link 
          to={`/product/${product.id}`}
          className="mt-3 inline-block bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-center w-full"
        >
          Get Details
        </Link>
      </div>
    </div>
  );
}