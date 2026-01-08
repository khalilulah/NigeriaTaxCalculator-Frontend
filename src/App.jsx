import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Loader2 } from "lucide-react";

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
      const response = await fetch(
        "https://nigeriataxcalculator-backend.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        }
      );

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

  // Improved markdown parser
  const parseMarkdown = (text) => {
    // First, handle bullet points with asterisks at start of line
    let parsed = text.replace(
      /^\*\s+(.+)$/gm,
      '<li class="ml-4 my-1.5">$1</li>'
    );

    // Handle bullet points with dash
    parsed = parsed.replace(/^-\s+(.+)$/gm, '<li class="ml-4 my-1.5">$1</li>');

    // Handle numbered lists
    parsed = parsed.replace(
      /^\d+\.\s+(.+)$/gm,
      '<li class="ml-4 my-1.5">$1</li>'
    );

    // Now handle bold (must be done AFTER list items to avoid conflicts)
    parsed = parsed.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    );

    // Handle italic
    parsed = parsed.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // Wrap consecutive <li> elements in <ul>
    parsed = parsed.replace(/(<li.*?<\/li>\s*)+/g, (match) => {
      return `<ul class="list-disc list-inside space-y-1.5 my-3">${match}</ul>`;
    });

    // Split into paragraphs and add spacing
    const paragraphs = parsed.split("\n\n");
    parsed = paragraphs
      .map((para) => {
        para = para.trim();
        if (!para) return "";

        // Don't wrap if it's already a list
        if (para.startsWith("<ul")) {
          return para;
        }

        // Replace single line breaks with <br>
        para = para.replace(/\n/g, '<br class="my-1">');

        return `<p class="my-3 leading-relaxed">${para}</p>`;
      })
      .filter((p) => p)
      .join("");

    return parsed;
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
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-2xl mb-3 sm:mb-4">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Nigeria Tax Assistant
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Ask me about the 2025 tax reforms
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 sm:gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="hidden sm:flex w-8 h-8 rounded-full bg-green-600 items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-3xl rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                  message.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                }`}
              >
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm sm:text-base">
                    {message.content}
                  </p>
                ) : (
                  <div
                    className="prose prose-sm max-w-none text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(message.content),
                    }}
                  />
                )}

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Sources:
                    </p>
                    <div className="space-y-1.5">
                      {message.sources.map((source, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 flex items-start gap-2"
                        >
                          <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="block">{source.source}</span>
                            <span className="text-green-600 font-medium">
                              ({(source.similarity * 100).toFixed(1)}% match)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-700 items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="hidden sm:flex w-8 h-8 rounded-full bg-green-600 items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
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
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Try asking:</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQuestion(question)}
                  className="text-xs sm:text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={sendMessage} className="sticky bottom-4 sm:bottom-10">
          <div className="flex gap-2 items-end bg-white border border-gray-300 rounded-2xl shadow-lg p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Nigeria's tax reforms..."
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-transparent outline-none text-sm sm:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-600 text-white rounded-xl px-3 py-2 sm:px-4 sm:py-3 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
