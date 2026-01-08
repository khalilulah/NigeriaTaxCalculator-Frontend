import { Calculator, MessageSquare, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Company Name */}
        <div className="flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Nigeria Tax Calculator
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Tax Reform Assistant
          </p>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-2">
          <Link
            to="/"
            className={`flex items-center h-12 gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isActive("/")
                ? "bg-green-600 text-white"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden lg:inline">Chat Assistant</span>
            <span className="lg:hidden">Chat</span>
          </Link>
          <Link
            to="/calculator"
            className={`flex items-center h-12 gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isActive("/calculator")
                ? "bg-green-600 text-white"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden lg:inline">Tax Calculator</span>
            <span className="lg:hidden">Calculator</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={toggleMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                isActive("/")
                  ? "bg-green-600 text-white"
                  : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Chat Assistant
            </Link>
            <Link
              to="/calculator"
              onClick={toggleMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                isActive("/calculator")
                  ? "bg-green-600 text-white"
                  : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Calculator className="w-5 h-5" />
              Tax Calculator
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
