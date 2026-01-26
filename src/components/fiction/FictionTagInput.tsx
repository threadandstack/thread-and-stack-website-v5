import { useState, useRef, KeyboardEvent } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookLoadingIcon } from "./BookLoadingIcon";

interface FictionTagInputProps {
  onSubmit: (titles: string[]) => void;
  isSubmitting: boolean;
}

export function FictionTagInput({ onSubmit, isSubmitting }: FictionTagInputProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      } else if (e.key === "Enter" && tags.length > 0) {
        handleSubmit();
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleSubmit = () => {
    // Combine tags with any remaining input
    const allTitles = [...tags];
    if (inputValue.trim()) {
      allTitles.push(inputValue.trim());
    }
    
    if (allTitles.length > 0) {
      onSubmit(allTitles);
      setTags([]);
      setInputValue("");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.includes(",")) {
      e.preventDefault();
      const newTags = pasted.split(",").map(t => t.trim()).filter(t => t);
      const uniqueTags = newTags.filter(t => !tags.includes(t));
      setTags([...tags, ...uniqueTags]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
          relative flex flex-wrap items-center gap-2 min-h-[3rem] md:min-h-[3.5rem] 
          px-4 py-2 pr-14 rounded-full border-2 border-accent/20 
          focus-within:border-accent transition-colors bg-background
          ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}
        `}
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence mode="popLayout">
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={isSubmitting}
          placeholder={tags.length === 0 ? "The Great Gatsby, Dune, Harry Potter..." : "Add another..."}
          className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-base md:text-lg placeholder:text-muted-foreground/60"
        />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || (tags.length === 0 && !inputValue.trim())}
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 rounded-full bg-accent hover:bg-accent/90"
        >
          {isSubmitting ? (
            <BookLoadingIcon className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </Button>
      </div>

      <p className="text-muted-foreground text-sm text-center mt-3">
        Feel free to include more than one book — just separate them with commas!
      </p>
    </div>
  );
}
