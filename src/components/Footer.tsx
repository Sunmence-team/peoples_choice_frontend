import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { assets } from "../assets/assets";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary px-6 pt-8 text-white md:px-4 lg:px-8">
      <div>
        <div className="grid gap-8 pb-7 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src={assets.Untitleddesign}
              alt="Go4bill"
              className="h-25 w-auto"
            />

            <p className="mt-2 max-w-[190px] text-[9px] lg:text-[14px] leading-5 text-white">
              A simple and transparent way to manage your digital funds,
              deposits and withdrawals.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full
                border border-white text-[9px] text-white
                transition duration-300 hover:bg-light/10 hover:border-light hover:text-white"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full
                border border-white text-[9px] text-white
                transition duration-300 hover:bg-light/10 hover:border-light hover:text-white"
              >
                <FaTwitter size={20} />
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full
                border border-white text-[9px] text-white
                transition duration-300 hover:bg-light/10 hover:border-light hover:text-white"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full
                border border-white text-[9px] text-white
                transition duration-300 hover:bg-light/10 hover:border-light hover:text-white"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] lg:text-xl font-bold">Platform</h3>

            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  FAQs
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Create Account
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-[10px] lg:text-xl font-bold">Account</h3>

            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Login
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Register
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  My Wallet
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Transactions
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] lg:text-xl font-bold">Support</h3>

            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Contact Us
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Help Center
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-lighty"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[9px] lg:text-[12px] text-white transition hover:text-light"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-3 border-t border-light py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* <a
            href="#"
            className="flex items-center gap-1 text-[8px] text-white/60 transition hover:text-white"
          >
            Back to top
            <FaArrowRight className="-rotate-90" size={8} />
          </a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
