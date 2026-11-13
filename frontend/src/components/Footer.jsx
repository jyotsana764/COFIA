import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="text-sm">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40">
        {/* COFIA Brand */}
        <div>
          <img
            src="/cofia-logo.png"
            alt="COFIA - Explore Your Style"
            className="mb-5 w-32"
          />

          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            COFIA — Explore Your Style. Discover elegant designs,
            timeless fashion, and carefully selected styles that
            help you express your individuality. Find your next
            favourite look with COFIA.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>

          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              onClick={() => handleNavigation('/')}
              className="cursor-pointer hover:text-black transition-colors"
            >
              Home
            </li>

            <li
              onClick={() => handleNavigation('/collection')}
              className="cursor-pointer hover:text-black transition-colors"
            >
              Collection
            </li>

            <li
              onClick={() => handleNavigation('/about')}
              className="cursor-pointer hover:text-black transition-colors"
            >
              About Us
            </li>

            <li
              onClick={() => handleNavigation('/contact')}
              className="cursor-pointer hover:text-black transition-colors"
            >
              Contact Us
            </li>

            <li className="cursor-pointer hover:text-black transition-colors">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>

          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              Email: Contact us through our Contact page.
            </li>

            <li>
              <span
                onClick={() => handleNavigation('/contact')}
                className="cursor-pointer underline hover:text-black"
              >
                Contact COFIA
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div>
        <hr />

        <p className="py-5 text-sm text-center">
          Copyright © 2026 COFIA — All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;