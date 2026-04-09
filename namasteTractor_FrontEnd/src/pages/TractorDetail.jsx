import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTractorById, filterTractors, getTractors } from "../api";
import TractorCard from "../context/components/TractorCard";


export default function TractorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tractor, setTractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sameBrandTractors, setSameBrandTractors] = useState([]);
  const [otherTractors, setOtherTractors] = useState([]);
  const [loadingSame, setLoadingSame] = useState(false);
  const [loadingOther, setLoadingOther] = useState(false);

  useEffect(() => {
    const fetchTractor = async () => {
      try {
        const res = await getTractorById(id);
        setTractor(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tractor details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTractor();
  }, [id]);

  // Fetch same brand tractors (excluding current)
  useEffect(() => {
    if (tractor?.brand) {
      const fetchSameBrand = async () => {
        setLoadingSame(true);
        try {
          // First get all brands to map brand name to brandId if needed
          // But your filter endpoint might accept brand name? We'll assume it accepts brandId.
          // Since we don't have brandId from tractor, we need to get brand list or modify backend.
          // Simpler: fetch all tractors and filter by brand name client-side.
          // But for scalability, better to get brandId first. Let's do client-side filter for now.
          const res = await getTractors(0, 50); // fetch many
          const filtered = res.data.filter(t => t.brand === tractor.brand && t.id !== tractor.id);
          setSameBrandTractors(filtered.slice(0, 4));
        } catch (err) {
          console.error("Failed to fetch same brand tractors", err);
        } finally {
          setLoadingSame(false);
        }
      };
      fetchSameBrand();
    }
  }, [tractor]);

  // Fetch other tractors (different brand, excluding current)
  useEffect(() => {
    if (tractor?.brand) {
      const fetchOther = async () => {
        setLoadingOther(true);
        try {
          const res = await getTractors(0, 50);
          const filtered = res.data.filter(t => t.brand !== tractor.brand && t.id !== tractor.id);
          setOtherTractors(filtered.slice(0, 4));
        } catch (err) {
          console.error("Failed to fetch other tractors", err);
        } finally {
          setLoadingOther(false);
        }
      };
      fetchOther();
    }
  }, [tractor]);

  const handleEnquiry = () => {
    const message = `I am interested in ${tractor.brand} ${tractor.model} (HP: ${tractor.hp}, Price: ₹${tractor.price.toLocaleString()})`;
    navigate("/enquiry/new", {
      state: {
        prefillMessage: message,
        prefillEnquiryType: "PURCHASE_QUERY",
      },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-8 w-1/2 mb-2"></div>
          <div className="bg-gray-200 h-4 w-1/4 mb-4"></div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !tractor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Tractor not found"}
        </div>
        <Link to="/" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  const mainImage = tractor.images?.find(img => img.imageType === "MAIN")?.imageUrl ||
                    tractor.images?.[0]?.imageUrl ||
                    "https://via.placeholder.com/800x500?text=No+Image";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="mb-4 text-green-600 hover:text-green-800">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image section */}
        <div>
          <img src={mainImage} alt={tractor.model} className="w-full rounded-lg shadow-lg object-cover h-96" />
          {tractor.images && tractor.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {tractor.images.map((img, idx) => (
                <img key={idx} src={img.imageUrl} alt={`Thumb ${idx}`} className="w-20 h-20 object-cover rounded cursor-pointer border-2 hover:border-green-500" />
              ))}
            </div>
          )}
        </div>

        {/* Details section */}
        <div>
          <h1 className="text-3xl font-bold">{tractor.brand} {tractor.model}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {tractor.hp} HP
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700 mt-4">₹{tractor.price.toLocaleString()}</p>

          <button
            onClick={handleEnquiry}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            📞 Raise Enquiry for this Tractor
          </button>

          {/* Specifications */}
          {tractor.specification && (
            <div className="mt-8">
              <h2 className="text-xl font-bold border-b-2 border-green-600 pb-2 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                <SpecRow label="Cylinder" value={tractor.specification.cylinder} />
                <SpecRow label="Engine Capacity" value={tractor.specification.engineCapacity ? `${tractor.specification.engineCapacity} cc` : null} />
                <SpecRow label="Clutch" value={tractor.specification.clutch} />
                <SpecRow label="Steering" value={tractor.specification.steering} />
                <SpecRow label="Gearbox" value={tractor.specification.gearbox} />
                <SpecRow label="Brakes" value={tractor.specification.brakes} />
                <SpecRow label="Torque" value={tractor.specification.torque ? `${tractor.specification.torque} Nm` : null} />
                <SpecRow label="Backup Torque" value={tractor.specification.backupTorque ? `${tractor.specification.backupTorque} Nm` : null} />
                <SpecRow label="PTO HP" value={tractor.specification.ptoHp} />
                <SpecRow label="PTO Options" value={tractor.specification.ptoOptions} />
                <SpecRow label="Front Tyre" value={tractor.specification.frontTyre} />
                <SpecRow label="Rear Tyre" value={tractor.specification.rearTyre} />
                <SpecRow label="Front Axle" value={tractor.specification.frontAxle} />
                <SpecRow label="Rear Axle" value={tractor.specification.rearAxle} />
                <SpecRow label="Reduction" value={tractor.specification.reduction} />
                <SpecRow label="Service Interval" value={tractor.specification.serviceInterval ? `${tractor.specification.serviceInterval} hrs` : null} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Same Brand Tractors */}
      {!loadingSame && sameBrandTractors.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold border-l-4 border-green-600 pl-3 mb-6">
            More {tractor.brand} Tractors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sameBrandTractors.map(t => <TractorCard key={t.id} tractor={t} />)}
          </div>
        </div>
      )}

      {/* Other Tractors */}
      {!loadingOther && otherTractors.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold border-l-4 border-green-600 pl-3 mb-6">
            Other Popular Tractors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {otherTractors.map(t => <TractorCard key={t.id} tractor={t} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b py-2">
      <span className="font-semibold text-gray-600">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}