export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">KrishiSeva</h3>
            <p className="text-gray-400">Empowering farmers with technology</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-green-400">Contact Us</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">YouTube</a>
            <a href="#" className="hover:text-green-400">Privacy Policy</a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} KrishiSeva. All rights reserved.
        </div>
      </div>
    </footer>
  );
}