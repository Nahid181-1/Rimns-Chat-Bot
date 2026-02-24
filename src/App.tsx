import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Plus, 
  Search, 
  Settings, 
  Sparkles, 
  Code, 
  GraduationCap, 
  Languages, 
  Wrench, 
  Rocket,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2
} from "lucide-react";
import { gemini, Message } from "./services/gemini";
import { ChatMessage } from "./components/ChatMessage";
import { cn } from "./lib/utils";

const MODES = [
  { id: "general", name: "General Assistant", icon: Sparkles, color: "text-indigo-600" },
  { id: "coding", name: "Coding Mode", icon: Code, color: "text-blue-600" },
  { id: "learning", name: "Learning Mode", icon: GraduationCap, color: "text-emerald-600" },
  { id: "ielts", name: "IELTS Trainer", icon: Languages, color: "text-orange-600" },
  { id: "problem", name: "Problem Solver", icon: Wrench, color: "text-rose-600" },
  { id: "project", name: "Project Builder", icon: Rocket, color: "text-purple-600" },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMode, setActiveMode] = useState("general");

  useEffect(() => {
    if (messages.length === 0) {
      const modeName = MODES.find(m => m.id === activeMode)?.name;
      setMessages([
        { 
          role: "model", 
          text: `Hello! I'm Rimns AI, your ${modeName}. How can I assist you today?` 
        }
      ]);
    }
  }, [activeMode]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      let fullResponse = "";
      const modelMessage: Message = { role: "model", text: "" };
      setMessages(prev => [...prev, modelMessage]);

      await gemini.chatStream(newMessages, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "model", text: fullResponse };
          return updated;
        });
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "model", text: "I encountered an error. Please check your API key and try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const modeName = MODES.find(m => m.id === activeMode)?.name;
    setMessages([
      { 
        role: "model", 
        text: `Hello! I'm Rimns AI, your ${modeName}. How can I assist you today?` 
      }
    ]);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="border-r border-zinc-200 bg-zinc-50 flex flex-col overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-zinc-900">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span>Rimns AI</span>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={clearChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Intelligence Modes
          </div>
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeMode === mode.id
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-100"
              )}
            >
              <mode.icon className={cn("h-4 w-4", mode.color)} />
              {mode.name}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-200 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:bg-zinc-100 transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-16 border-bottom border-zinc-200 flex items-center justify-between px-4 shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">
                {MODES.find(m => m.id === activeMode)?.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Pro
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={clearChat}
              className="p-2 hover:bg-red-50 rounded-lg text-zinc-500 hover:text-red-600 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          {messages.length <= 1 && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto space-y-6">
              <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                  How can I help you today?
                </h1>
                <p className="text-zinc-500 text-lg">
                  I'm Rimns AI, your intelligent partner for learning, coding, and problem solving.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-8">
                {[
                  "Explain quantum computing like I'm five",
                  "Write a React hook for local storage",
                  "Help me practice for IELTS Speaking Part 2",
                  "Create a roadmap for learning TypeScript"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="p-4 text-left rounded-xl border border-zinc-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                  >
                    <p className="text-sm font-medium text-zinc-700 group-hover:text-indigo-700">
                      {suggestion}
                    </p>
                  </button>
                ))}
              </div>
              
              {messages.length === 1 && (
                <div className="w-full max-w-4xl mt-8">
                  <ChatMessage 
                    role={messages[0].role} 
                    text={messages[0].text} 
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              {messages.map((msg, i) => (
                <ChatMessage 
                  key={i} 
                  role={msg.role} 
                  text={msg.text} 
                  isLatest={i === messages.length - 1}
                />
              ))}
              {isLoading && messages[messages.length - 1].role === "user" && (
                <div className="p-6 flex gap-4 animate-pulse">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-zinc-100 rounded" />
                    <div className="h-4 w-full bg-zinc-50 rounded" />
                    <div className="h-4 w-2/3 bg-zinc-50 rounded" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-200 bg-white">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Rimns AI..."
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all bg-zinc-50 focus:bg-white"
              style={{ minHeight: "44px", maxHeight: "200px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2 bottom-2 p-2 rounded-lg transition-all",
                input.trim() && !isLoading
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                  : "text-zinc-400 cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-zinc-400 mt-2">
            Rimns AI can make mistakes. Check important info.
          </p>
        </div>
      </main>
    </div>
  );
}
