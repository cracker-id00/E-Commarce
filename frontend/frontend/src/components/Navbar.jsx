import { Link,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ROUTES } from "./Urls.jsx";
import "../Style/Navbar.css";
import { useUser } from "./UserContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  //const token = localStorage.getItem("access_token");
  const { user,setUser } = useUser();

  const handelLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate(ROUTES.LOGIN);
    
  }
  
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to={ROUTES.HOME} className="hover:text-gray-300">Nisha's Crochet World</Link>
        </h1>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-baseline">
          { user ? (
            <>
              <li><Link to={ROUTES.PROFILE} className="bg-red-500 px-4 py-2 rounded">{user.first_name}</Link></li>
              <li><Link to={ROUTES.CART} className="bg-red-500 px-4 py-2 rounded">My Cart</Link></li>
              <li><button onClick={handelLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button></li>
            </>
          ) : (
              <>
                <li><Link to={ROUTES.LOGIN} className="hover:text-gray-300">Login</Link></li>
                <li><Link to={ROUTES.REGISTER} className="hover:text-gray-300">Sign Up</Link></li>
              </>
          )}
          
  
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
