import { Outlet, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Navbar from "../components/navs/Navbar";
import Footer from "../components/Footer";

const HomeLayout: React.FC = () => {
  const { pathname, hash } = useLocation();

  let pageName = "Page";
  if (pathname === "/") {
    pageName = "Home";
  } else if (pathname === "/services") {
    pageName = "Services";
  } else if (pathname === "/contact") {
    pageName = "Contact Us";
  }

  useEffect(() => {
    document.title = `Platform page | ${pageName}`;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pageName, pathname, hash]);

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
