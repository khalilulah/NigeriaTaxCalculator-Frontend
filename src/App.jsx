import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Loader2 } from "lucide-react";
import NavBar from "./NavBar";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Nigeria Tax Assistant. Ask me anything about Nigeria's 2025 tax reforms and I'll help you understand the new tax laws.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to backend
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample questions for quick start
  const sampleQuestions = [
    "What are the key changes in Nigeria's 2025 tax reform?",
    "What is the new income tax exemption limit?",
    "How does the Joint Revenue Board Act prevent double taxation?",
  ];

  const handleSampleQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className=" py-8 px-4">
      {/* Header */}

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nigeria Tax Assistant
          </h1>
          <p className="text-gray-600">Ask me about the 2025 tax reforms</p>
        </div>
      </div>

      {/* Main Chat Container */}
      <main className="max-w-5xl mx-auto px-4 py-6  flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Questions (show only at start) */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQuestion(question)}
                  className="text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={sendMessage} className="sticky bottom-10 ">
          <div className="flex gap-2 items-end bg-white border border-gray-300 rounded-2xl shadow-lg p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Nigeria's tax reforms..."
              className="flex-1 px-4 py-3 bg-transparent outline-none resize-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-600 text-white rounded-xl px-4 py-3 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
