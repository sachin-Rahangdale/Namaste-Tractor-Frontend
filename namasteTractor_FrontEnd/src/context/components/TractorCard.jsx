import { Link } from "react-router-dom";

export default function TractorCard({ tractor }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      <img 
        src={tractor.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"} 
        alt={tractor.model}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl">{tractor.model}</h3>
        <p className="text-gray-600">Brand: {tractor.brand}</p>
        <p className="text-gray-600">HP: {tractor.hp}</p>
        <p className="text-green-700 font-bold mt-2">₹{tractor.price.toLocaleString()}</p>
        <Link 
          to={`/tractor/${tractor.id}`}
          className="mt-3 inline-block bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-center w-full"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}