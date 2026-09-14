import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { navItems } from "../../lib/navItems";
import { assets } from "../../assets/assets";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLinkClick = (href: string, isPage: boolean) => {
    if (!isPage || pathname === href) {
      setOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-white"
      }`}
    >
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src={assets.logo}
                alt="Go4bill"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navItems.map((link) => 
              link.isPage ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={isHome ? link.href : `/${link.href}`}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center">
            <a
              href={isHome ? "#get-started" : "/#get-started"}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#092545]"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {open ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="space-y-3 px-4 pt-4 pb-6">
            {navItems.map((link) => 
              link.isPage ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleLinkClick(link.href, true)}
                  className="block rounded-md px-2 py-2 text-base text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={() => handleLinkClick(link.href, false)}
                  className="block rounded-md px-2 py-2 text-base text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </a>
              )
            )}

            <a
              href={isHome ? "#get-started" : "/#get-started"}
              onClick={() => handleLinkClick("#get-started", false)}
              className="mt-2 block rounded-md bg-primary px-4 py-2 text-center text-white transition-all duration-200 hover:bg-[#092545]"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;