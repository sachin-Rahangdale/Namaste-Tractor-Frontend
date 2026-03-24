import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTractorById } from "../api/tractorApi";

const TractorDetail = () => {
  const { id } = useParams();
  const [tractor, setTractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTractor();
  }, [id]);

  const fetchTractor = async () => {
    try {
      const res = await getTractorById(id);
      const data = res.data;

      setTractor(data);

      // ✅ Set MAIN image index
      const mainIndex = data.images.findIndex(
        (img) => img.imageType === "MAIN"
      );

      setCurrentIndex(mainIndex !== -1 ? mainIndex : 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Slider logic
  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === tractor.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? tractor.images.length - 1 : prev - 1
    );
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (!tractor) return <div className="p-5">Tractor not found</div>;

  const currentImage = tractor.images[currentIndex]?.imageUrl;

  return (
    <div className="p-5 max-w-5xl mx-auto">
      
      {/* 🔥 IMAGE SLIDER */}
      <div className="relative mb-4">
        <img
          src={currentImage || "https://via.placeholder.com/600x300"}
          alt={tractor.model}
          className="w-full h-80 object-cover rounded"
        />

        {/* ⬅️ LEFT */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
        >
          ◀
        </button>

        {/* ➡️ RIGHT */}
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
        >
          ▶
        </button>
      </div>

      {/* 🖼️ THUMBNAILS */}
      <div className="flex gap-3 mb-4">
        {tractor.images.map((img, index) => (
          <img
            key={index}
            src={img.imageUrl}
            alt="thumb"
            onClick={() => setCurrentIndex(index)}
            className={`w-24 h-16 object-cover rounded cursor-pointer border ${
              index === currentIndex ? "border-blue-500" : ""
            }`}
          />
        ))}
      </div>

      {/* 🚜 BASIC INFO */}
      <h1 className="text-2xl font-bold mb-2">
        {tractor.model.toUpperCase()}
      </h1>

      <p className="mb-1">Brand: {tractor.brand}</p>
      <p className="mb-1">HP: {tractor.hp}</p>
      <p className="mb-4 text-green-600 font-semibold">
        ₹ {tractor.price.toLocaleString()}
      </p>

      {/* ⚙️ SPECIFICATIONS (MANUAL + NULL SAFE) */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Specifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">

          {tractor.specification?.cylinder != null && (
            <p>Cylinder: {tractor.specification.cylinder}</p>
          )}

          {tractor.specification?.engineCapacity != null && (
            <p>Engine Capacity: {tractor.specification.engineCapacity} cc</p>
          )}

          {tractor.specification?.ptoHp != null && (
            <p>PTO HP: {tractor.specification.ptoHp}</p>
          )}

          {tractor.specification?.torque != null && (
            <p>Torque: {tractor.specification.torque} Nm</p>
          )}

          {tractor.specification?.backupTorque != null && (
            <p>Backup Torque: {tractor.specification.backupTorque}%</p>
          )}

          {tractor.specification?.clutch != null && (
            <p>Clutch: {tractor.specification.clutch}</p>
          )}

          {tractor.specification?.steering != null && (
            <p>Steering: {tractor.specification.steering}</p>
          )}

          {tractor.specification?.gearbox != null && (
            <p>Gearbox: {tractor.specification.gearbox}</p>
          )}

          {tractor.specification?.brakes != null && (
            <p>Brakes: {tractor.specification.brakes}</p>
          )}

          {tractor.specification?.ptoOptions != null && (
            <p>PTO Options: {tractor.specification.ptoOptions}</p>
          )}

          {tractor.specification?.frontTyre != null && (
            <p>Front Tyre: {tractor.specification.frontTyre}</p>
          )}

          {tractor.specification?.rearTyre != null && (
            <p>Rear Tyre: {tractor.specification.rearTyre}</p>
          )}

          {tractor.specification?.frontAxle != null && (
            <p>Front Axle: {tractor.specification.frontAxle}</p>
          )}

          {tractor.specification?.rearAxle != null && (
            <p>Rear Axle: {tractor.specification.rearAxle}</p>
          )}

          {tractor.specification?.reduction != null && (
            <p>Reduction: {tractor.specification.reduction}</p>
          )}

          {tractor.specification?.serviceInterval != null && (
            <p>Service Interval: {tractor.specification.serviceInterval} hrs</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default TractorDetail;