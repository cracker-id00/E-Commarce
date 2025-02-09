const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        
        {/* Left Side - Brand Name */}
        <h1 className="text-xl font-bold">Nisha's Crochet</h1>

        {/* Middle - Navigation Links */}
        <ul className="flex space-x-6 text-sm mt-4 md:mt-0">
          <li><a href="/" className="hover:text-gray-400">Home</a></li>
          <li><a href="/about" className="hover:text-gray-400">About</a></li>
          <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
        </ul>

        {/* Right Side - Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-400">
            <i className="fab fa-facebook text-xl"></i>
          </a>
          <a href="#" className="hover:text-gray-400">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="hover:text-gray-400">
            <i className="fab fa-instagram text-xl"></i>
          </a>
        </div>
      </div>

      {/* Bottom - Copyright */}
      <div className="text-center text-sm mt-4">
        © {new Date().getFullYear()} MyWebsite. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
