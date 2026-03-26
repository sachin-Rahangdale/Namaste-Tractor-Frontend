const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 🚜 ABOUT */}
        <div>
          <h2 className="text-xl font-bold mb-2">Namaste Tractors 🚜</h2>
          <p className="text-sm text-gray-400">
            Your trusted platform for tractors, farming news, and updates.
          </p>
        </div>

        {/* 📩 CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>

          <p className="text-sm text-gray-400">
            📧 Email: namastetractors@gmail.com
          </p>

          <p className="text-sm text-gray-400">
            📍 Nagpur, Maharashtra, India
          </p>
        </div>

        {/* 🔗 SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>

          <p className="text-sm text-gray-400">
            📸 Instagram: @namastetractors
          </p>

          <p className="text-sm text-gray-400">
            ▶️ YouTube: Namaste Tractors
          </p>
        </div>
      </div>

      {/* 🔻 BOTTOM */}
      <div className="text-center text-gray-500 text-sm border-t border-gray-700 py-3">
        © {new Date().getFullYear()} Namaste Tractors. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;