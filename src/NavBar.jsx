import { Calculator, FileText, MessageSquare } from "lucide-react";
import React from "react";
import { useLocation, Link } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-20 justify-between flex items-center">
        {/* Company Name */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Nigeria Tax Calculator
          </h1>
          <p className="text-sm text-gray-600">Tax Reform Assistant</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Link
            to="/"
            className={`flex items-center h-12 gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isActive("/")
                ? "bg-green-600 text-white"
                : "text-gray-600 bg-gray-100 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat Assistant
          </Link>
          <Link
            to="/calculator"
            className={`flex items-center h-12 gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isActive("/calculator")
                ? "bg-green-600 text-white"
                : "text-gray-600 bg-gray-100 hover:bg-gray-300"
            }`}
          >
            <Calculator className="w-4 h-4" />
            Tax Calculator
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
