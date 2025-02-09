export const ROUTES = {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    LOGIN: "/login",
  };
  
  import Home from "../pages/Home.jsx";
  import About from "../pages/About.jsx";
  import Contact from "../pages/Contact.jsx";
  import Login from "../pages/Login.jsx";
  
  const routes = [
    { path: ROUTES.HOME, element: <Home /> },
    { path: ROUTES.ABOUT, element: <About /> },
    { path: ROUTES.CONTACT, element: <Contact /> },
    { path: ROUTES.LOGIN, element: <Login /> },
  ];
  
  export default routes;
  