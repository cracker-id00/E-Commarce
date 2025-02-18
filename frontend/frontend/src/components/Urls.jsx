export const ROUTES = {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    CART: "/cart",
  };
  
  import Home from "../pages/Home.jsx";
  import About from "../pages/About.jsx";
  import Contact from "../pages/Contact.jsx";
  import Login from "../pages/Login.jsx";
  import Register from "../pages/Register.jsx";
  import Profile from "../pages/Profile.jsx";
  import Cart from "../pages/Cart.jsx";
  
  const routes = [
    { path: ROUTES.HOME, element: <Home /> },
    { path: ROUTES.ABOUT, element: <About /> },
    { path: ROUTES.CONTACT, element: <Contact /> },
    { path: ROUTES.LOGIN, element: <Login /> },
    { path: ROUTES.REGISTER, element: <Register /> },
    { path: ROUTES.PROFILE, element: <Profile /> },
    { path: ROUTES.CART, element: <Cart /> },
  ];
  
  export default routes;
  