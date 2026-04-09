import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, filterProducts } from "../api";
import ProductCard from "../context/components/ProductCard";


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Image state
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Related products (same city)
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const data = res.data;
        setProduct(data);

        const imageUrls = data.imageUrls || [];
        if (imageUrls.length > 0) {
          setImages(imageUrls);
          setActiveIndex(0);
        } else {
          setImages(["https://via.placeholder.com/800x500?text=No+Image"]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch related products from the same city (after product loads)
  useEffect(() => {
    if (product?.city) {
      const fetchRelated = async () => {
        setLoadingRelated(true);
        try {
          const res = await filterProducts({ city: product.city, page: 0, size: 10 });
          // Exclude current product
          const filtered = (res.data.content || []).filter(p => p.id !== product.id);
          setRelatedProducts(filtered.slice(0, 4)); // show max 4
        } catch (err) {
          console.error("Failed to fetch related products", err);
        } finally {
          setLoadingRelated(false);
        }
      };
      fetchRelated();
    }
  }, [product]);

  // Carousel controls
  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCall = () => {
    if (product?.phone) {
      window.location.href = `tel:${product.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (product?.phone) {
      const phoneRaw = product.phone.replace(/\D/g, "");
      const message = `Hello, I am interested in your product: ${product.productName} (Price: ₹${product.price.toLocaleString()}, City: ${product.city}). Please share more details.`;
      window.open(`https://wa.me/${phoneRaw}?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl">Loading...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || "Product not found"}</p>
        <Link to="/" className="text-green-600 mt-4 block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="mb-4 text-green-600 hover:text-green-800">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <div className="relative">
            <img
              src={images[activeIndex]}
              alt={product.productName}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded shadow"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded shadow"
                >
                  ▶
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                onClick={() => setActiveIndex(idx)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition ${
                  activeIndex === idx ? "border-green-500 scale-105" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="text-green-600 text-2xl mt-3 font-bold">
            ₹{product.price.toLocaleString()} {product.unit}
          </p>
          <p className="text-gray-600 mt-2">📍 {product.city}</p>
          {product.pincode && <p className="text-gray-500">Pincode: {product.pincode}</p>}
          {product.description && (
            <div className="mt-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Seller */}
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Seller</h3>
            {product.phone ? (
              <>
                <p>📞 {product.phone}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={handleCall} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Call
                  </button>
                  <button onClick={handleWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded">
                    WhatsApp
                  </button>
                </div>
              </>
            ) : (
              <p>No contact info</p>
            )}
          </div>
        </div>
      </div>

      {/* 🆕 More Products from Same City */}
      {!loadingRelated && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold border-l-4 border-green-600 pl-3 mb-6">
            More Products from {product.city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}