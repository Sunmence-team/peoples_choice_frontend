import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { assets } from "../../assets/assets";
// import { navItems } from "../../../lib/navItems";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "How it work",
      href: "#how-it-works",
    },
    {
      label: "Faq",
      href: "#faq",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-white"
      }`}
    >
      <nav className="bg-light px-4 md:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={assets.peopelelog}
              alt="Go4bill"
              className="h-16 w-auto mb-2"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navItems.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block lg:flex lg:items-center">
            <Link
              to="/signup"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#092545]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100"
            >
              {open ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute left-0 top-16 z-50 w-full bg-white shadow-md lg:hidden">
          <div className="flex flex-col gap-4 px-6 py-5">
            {navItems.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-primary"
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

    
    </header>
  );
};

export default Navbar;
