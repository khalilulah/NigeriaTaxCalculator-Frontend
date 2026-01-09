import {
  Calculator,
  MessageSquare,
  Menu,
  X,
  MoreVertical,
  History,
  Scale,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "chat", icon: MessageSquare, label: "Chat", link: "/" },
    {
      id: "calculator",
      icon: Calculator,
      label: "Calculator",
      link: "/calculator",
    },
    { id: "history", icon: History, label: "History", link: "/history" },
  ];

  const activeTab = tabs.find((tab) => tab.link === location.pathname)?.id;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden z-10 md:flex w-16 bg-purple-950/50 flex-col items-center py-6 space-y-6 border-r border-purple-700/30">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
          <Scale className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 flex flex-col space-y-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.link}
              title={tab.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-600/50"
                  : "hover:bg-purple-600/50"
              }`}
            >
              <tab.icon
                className={`w-5 h-5 ${
                  activeTab === tab.id ? "text-purple-200" : "text-purple-300"
                }`}
              />
            </Link>
          ))}
        </div>

        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-purple-600/50">
          <MoreVertical className="w-5 h-5 text-purple-300" />
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-purple-950 border-r border-purple-700/30 z-50 transform transition-transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">Menu</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6 text-purple-300" />
            </button>
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  activeTab === tab.id
                    ? "bg-purple-600/50 text-white"
                    : "text-purple-300 hover:bg-purple-600/30"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className=" mt-3 absolute z-10 md:hidden w-9 h-9 flex items-center justify-center hover:bg-purple-700/40 rounded-lg"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>
    </>
  );
}

export default NavBar;
