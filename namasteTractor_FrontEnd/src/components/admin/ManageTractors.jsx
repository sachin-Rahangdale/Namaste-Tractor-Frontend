import { useEffect, useState } from "react";
import {
  getTractors,
  deleteTractor,
  addTractor,
  uploadTractorImage,
} from "../../api/tractorApi";

const ManageTractors = () => {
  const [tractors, setTractors] = useState([]);

  const [form, setForm] = useState({
    model: "",
    hp: "",
    price: "",
    brandId: "",
    specification: {
      cylinder: "",
      engineCapacity: "",
      clutch: "",
      steering: "",
      gearbox: "",
      brakes: "",
      torque: "",
      backupTorque: "",
      ptoHp: "",
      ptoOptions: "",
      frontTyre: "",
      rearTyre: "",
      rearAxle: "",
      frontAxle: "",
      reduction: "",
      serviceInterval: "",
    },
  });

  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);

  useEffect(() => {
    fetchTractors();
  }, []);

  const fetchTractors = async () => {
    const res = await getTractors();
    setTractors(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete tractor?")) return;
    await deleteTractor(id);
    fetchTractors();
  };

  // 🔹 BASIC INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 SPEC INPUT
  const handleSpecChange = (e) => {
    setForm({
      ...form,
      specification: {
        ...form.specification,
        [e.target.name]: e.target.value,
      },
    });
  };

  // 🔥 SUBMIT (CREATE + UPLOAD)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ CREATE TRACTOR
      const res = await addTractor({
        model: form.model,
        hp: Number(form.hp),
        price: Number(form.price),
        brandId: Number(form.brandId),
        specification: {
          cylinder: Number(form.specification.cylinder),
          engineCapacity: Number(form.specification.engineCapacity),
          clutch: form.specification.clutch,
          steering: form.specification.steering,
          gearbox: form.specification.gearbox,
          brakes: form.specification.brakes,
          torque: Number(form.specification.torque),
          backupTorque: Number(form.specification.backupTorque),
          ptoHp: form.specification.ptoHp,
          ptoOptions: form.specification.ptoOptions,
          frontTyre: form.specification.frontTyre,
          rearTyre: form.specification.rearTyre,
          rearAxle: form.specification.rearAxle,
          frontAxle: form.specification.frontAxle,
          reduction: form.specification.reduction,
          serviceInterval: Number(form.specification.serviceInterval),
        },
      });

      const tractorId = res.data.id;

      // 2️⃣ UPLOAD IMAGES
      for (let i = 0; i < images.length; i++) {
        const type = i === mainIndex ? "MAIN" : "THUMBNAIL";

        await uploadTractorImage(tractorId, images[i], type);
      }

      alert("Tractor created successfully");

      // 🔄 RESET
      setForm({
        model: "",
        hp: "",
        price: "",
        brandId: "",
        specification: {
          cylinder: "",
          engineCapacity: "",
          clutch: "",
          steering: "",
          gearbox: "",
          brakes: "",
          torque: "",
          backupTorque: "",
          ptoHp: "",
          ptoOptions: "",
          frontTyre: "",
          rearTyre: "",
          rearAxle: "",
          frontAxle: "",
          reduction: "",
          serviceInterval: "",
        },
      });

      setImages([]);
      setMainIndex(0);

      fetchTractors();
    } catch (err) {
      console.log(err);
      alert("Error creating tractor");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Tractors 🚜</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">

        <input name="model" placeholder="Model" value={form.model} onChange={handleChange} className="border p-2" />
        <input name="brandId" placeholder="Brand ID" value={form.brandId} onChange={handleChange} className="border p-2" />
        <input name="hp" type="number" placeholder="HP" value={form.hp} onChange={handleChange} className="border p-2" />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2" />

        {/* SPECIFICATIONS */}
        {Object.keys(form.specification).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form.specification[key]}
            onChange={handleSpecChange}
            className="border p-2"
          />
        ))}

        {/* IMAGE INPUT */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            setImages(Array.from(e.target.files));
            setMainIndex(0);
          }}
          className="col-span-2 border p-2"
        />

        {/* 🖼️ IMAGE PREVIEW */}
        <div className="col-span-2 flex gap-3 flex-wrap">
          {images.map((img, index) => (
            <div
              key={index}
              className={`p-2 border rounded ${
                index === mainIndex ? "border-blue-500" : ""
              }`}
            >
              <img
                src={URL.createObjectURL(img)}
                className="w-24 h-20 object-cover mb-1"
              />

              <label className="text-xs">
                <input
                  type="radio"
                  checked={mainIndex === index}
                  onChange={() => setMainIndex(index)}
                />
                Main
              </label>
            </div>
          ))}
        </div>

        <button className="col-span-2 bg-green-500 text-white py-2 rounded">
          Add Tractor
        </button>
      </form>

      {/* TABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {tractors.map((t) => (
    <div
      key={t.id}
      className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex justify-between items-center"
    >
      {/* LEFT SIDE */}
      <div>
        <h3 className="text-lg font-semibold">
          {t.model}
        </h3>

        <p className="text-sm text-gray-500">
          {t.brand} • {t.hp} HP
        </p>

        <p className="text-green-600 font-medium mt-1">
          ₹ {t.price.toLocaleString()}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-2 items-end">
        <button
          onClick={() => handleDelete(t.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default ManageTractors;