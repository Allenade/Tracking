"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "../hooks/useTranslation";

export default function Navbar() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                <Image
                  src="/images/logos.jpeg"
                  alt="Secure Lanes Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                Secure Lanes
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/about"
              className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
            >
              {t("aboutUs")}
            </a>
            <a
              href="/contact"
              className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
            >
              {t("contactUs")}
            </a>
            <a
              href="/track"
              className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
            >
              {t("track")}
            </a>
          </nav>

          {/* Right side - Language selector and mobile menu button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-1 pb-2 space-y-0.5 sm:px-3 border-t border-gray-200">
              <a
                href="/about"
                className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("aboutUs")}
              </a>
              <a
                href="/contact"
                className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("contactUs")}
              </a>
              <a
                href="/track"
                className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("track")}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
