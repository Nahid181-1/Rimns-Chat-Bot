import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "motion/react";
import { User, Bot, Copy, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ChatMessageProps {
  role: "user" | "model";
  text: string;
  isLatest?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, text, isLatest }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-4 p-6 transition-colors",
        role === "model" ? "bg-zinc-50/50" : "bg-transparent"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border bg-white shadow-sm">
        {role === "user" ? (
          <User className="h-5 w-5 text-zinc-600" />
        ) : (
          <Bot className="h-5 w-5 text-indigo-600" />
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900">
            {role === "user" ? "You" : "Rimns AI"}
          </span>
          {role === "model" && (
            <button
              onClick={handleCopy}
              className="rounded-md p-1 hover:bg-zinc-200 transition-colors text-zinc-400 hover:text-zinc-600"
              title="Copy response"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
        </div>
        
        <div className="markdown-body prose prose-zinc max-w-none prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:rounded">
          <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};
