import { useNavigate } from "react-router-dom";

const TractorCard = ({ tractor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tractors/${tractor.id}`);
  };

  return (
    <div
      onClick={handleClick}   // ✅ FIX HERE
      className="border rounded-lg p-4 shadow hover:shadow-xl transition duration-300 cursor-pointer"
    >
      {/* 🖼️ IMAGE */}
      <img
        src={
          tractor.imageUrl ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={tractor.model}
        className="w-full h-40 object-cover rounded mb-3"
      />

      {/* 🚜 INFO */}
      <h2 className="text-lg font-bold mb-1">
        {tractor.model.toUpperCase()}
      </h2>

      <p className="text-sm text-gray-600 mb-1">
        Brand: <span className="font-medium">{tractor.brand}</span>
      </p>

      <p className="text-sm text-gray-600 mb-1">
        HP: <span className="font-medium">{tractor.hp}</span>
      </p>

      <p className="text-sm text-green-600 font-semibold">
        ₹ {tractor.price.toLocaleString()}
      </p>
    </div>
  );
};

export default TractorCard;