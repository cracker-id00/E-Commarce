import { Link,useNavigate } from "react-router-dom";
import { ROUTES } from "./Urls.jsx";
import "../Style/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  
  const handelLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate(ROUTES.LOGIN);
  }
  
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to={ROUTES.HOME} className="hover:text-gray-300">MyWebsite</Link>
        </h1>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          { token ? (
            <>
              <li><button onClick={handelLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button></li>
            </>
          ) : (
              <li><Link to={ROUTES.LOGIN} className="hover:text-gray-300">Login</Link></li>
          )}
          
  
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
