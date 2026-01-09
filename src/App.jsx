import { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageSquare,
  Scale,
  Calculator,
  History,
  Download,
  MoreVertical,
  ThumbsUp,
  Copy,
  Bookmark,
  Menu,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Link } from "react-router-dom";
import NavBar from "./NavBar";

function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Nigeria Tax Assistant. Ask me anything about Nigeria's 2025 tax reforms and I'll help you understand the new tax laws.",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const tabs = [
    { id: "chat", icon: MessageSquare, label: "Chat", link: "/" },
    {
      id: "calculator",
      icon: Calculator,
      label: "Calculator",
      link: "/calculator",
    },
    { id: "history", icon: History, label: "History", link: "/calculator" },
  ];

  const sampleQuestions = [
    "What are the key changes in Nigeria's 2025 tax reform?",
    "What is the new income tax exemption limit?",
    "How does the Joint Revenue Board Act prevent double taxation?",
    "What are the tax rates for small businesses?",
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSampleQuestion = (question) => setInput(question);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://nigeriataxcalculator-backend.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          sources: [],
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className=" flex h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Desktop Sidebar */}
      <NavBar />
      {/* Mobile Menu Overlay */}

      {/* Mobile Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 sm:h-16 bg-purple-950/30 backdrop-blur-sm border-b border-purple-700/30 flex flex-row-reverse sm:flex-row items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-white font-semibold text-sm sm:text-lg">
              Nigeria Tax Calculator
            </h1>
            <span className="hidden sm:inline px-3 py-1 bg-purple-600/40 text-purple-200 text-xs rounded-full">
              AI Powered
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className=" hidden w-8 h-8 sm:w-9 sm:h-9 bg-purple-700/40 hover:bg-purple-700/60 rounded-lg flex items-center justify-center transition-colors">
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 relative overflow-y-auto bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            {/* Welcome Section */}
            {chatMessages.length === 1 && (
              <div className="mb-6 sm:mb-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl sm:rounded-3xl mb-3 sm:mb-4 shadow-lg">
                    <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 px-4">
                    Nigeria Tax Calculator
                  </h2>
                  <p className="text-purple-200 text-sm sm:text-base px-4">
                    Ask me anything about Nigerian tax regulations, compliance,
                    and legislation
                  </p>
                </div>

                <div className="mb-6 sm:mb-8">
                  <p className="text-purple-200 text-center mb-4 sm:mb-6 text-sm sm:text-base">
                    Try asking:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
                    {sampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSampleQuestion(question)}
                        className="bg-purple-800/40 backdrop-blur-sm border border-purple-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left hover:bg-purple-700/40 hover:border-purple-500/50 transition-all group"
                      >
                        <p className="text-white text-xs sm:text-sm leading-relaxed group-hover:text-purple-100">
                          {question}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="pb-12 ">
              <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 sm:gap-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl items-center justify-center flex-shrink-0">
                        <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}

                    <div className="flex flex-col max-w-[85%] sm:max-w-2xl">
                      <div
                        className={`rounded-xl sm:rounded-2xl px-3 py-3 sm:px-5 sm:py-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : " bg-slate-800/60 rounded-lg sm:rounded-xl border border-slate-700/50"
                        }`}
                      >
                        {message.role === "user" ? (
                          <p className="text-xs sm:text-sm">
                            {message.content}
                          </p>
                        ) : (
                          <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed text-xs sm:text-sm">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                table: ({ children }) => (
                                  <div className="overflow-x-auto my-4">
                                    <table className="w-full border border-slate-700 rounded-lg">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                th: ({ children }) => (
                                  <th className="border border-slate-700 bg-slate-800 px-3 py-2 text-left text-purple-200">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border border-slate-700 px-3 py-2 align-top">
                                    {children}
                                  </td>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 px-2">
                        <span className="text-xs text-purple-300">
                          {message.timestamp || "Just now"}
                        </span>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <button className="text-purple-300 hover:text-purple-200 transition-colors">
                              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 sm:mt-3 px-3 py-2 sm:px-5 sm:py-3 bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700/50">
                          <p className="text-xs font-semibold text-purple-300 mb-1.5 sm:mb-2">
                            Sources:
                          </p>
                          <div className="space-y-1 sm:space-y-1.5">
                            {message.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-purple-200 flex items-start gap-1.5 sm:gap-2"
                              >
                                <span className="block">{source.source}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-xl items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs sm:text-sm font-semibold">
                          U
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 sm:gap-4 justify-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                      <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4">
                      <p className="text-purple-300 text-xs sm:text-sm">
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
        {/* Input Area */}
        <div
          className="absolute bottom-0 left-0 md:left-16 right-0 z-30 px-3 sm:px-6 pb-4 sm:pb-6
   bg-gradient-to-br from-transparent via-purple-800 to-indigo-900"
        >
          <div className="max-w-5xl mx-auto ">
            <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Nigeria tax law..."
                disabled={isLoading}
                className="w-full bg-transparent text-white placeholder-purple-400 rounded-2xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-purple-500/40 transition text-sm sm:text-base"
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 rounded-xl flex items-center justify-center transition"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
