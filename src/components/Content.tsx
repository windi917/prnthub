import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Content = () => {
  return (
    <div className="Content-main">
      <Navbar />

      <div className="Outlet">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Content;
