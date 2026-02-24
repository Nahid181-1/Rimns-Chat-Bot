import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "motion/react";
import { User, Bot, Copy, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ChatMessageProps {
  role: "user" | "model";
  text: string;
  images?: string[];
  isLatest?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, text, images, isLatest }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full mb-4 px-4 sm:px-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 shadow-sm",
          isUser 
            ? "bg-indigo-600 text-white rounded-tr-none" 
            : "bg-white border border-zinc-200 text-zinc-900 rounded-tl-none"
        )}
      >
        {/* Role Label & Actions */}
        <div className="flex items-center justify-between mb-1 gap-4">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            isUser ? "text-indigo-100" : "text-zinc-400"
          )}>
            {isUser ? "You" : "Rimns AI"}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="rounded-md p-1 hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
              title="Copy response"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>
        
        {/* Images */}
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="Uploaded content" 
                className="max-w-full rounded-lg object-cover border border-black/5 shadow-sm"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        )}

        {/* Text Content */}
        <div className={cn(
          "markdown-body prose max-w-none text-sm sm:text-base leading-relaxed",
          isUser 
            ? "prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-code:text-indigo-200 prose-code:bg-indigo-700/50" 
            : "prose-zinc prose-p:text-zinc-800 prose-code:text-indigo-600 prose-code:bg-indigo-50"
        )}>
          <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
        </div>

        {/* Bubble Tail (Optional visual flair) */}
        <div 
          className={cn(
            "absolute top-0 w-2 h-2",
            isUser 
              ? "-right-1 bg-indigo-600 [clip-path:polygon(0_0,0_100%,100%_0)]" 
              : "-left-1 bg-white border-l border-t border-zinc-200 [clip-path:polygon(0_0,100%_0,100%_100%)]"
          )}
        />
      </div>
    </motion.div>
  );
};
