"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={`
        fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg
        transition-all duration-300 ease-in-out z-50
        bg-primary hover:bg-primary/90 text-primary-foreground
        hover:scale-110 hover:shadow-xl
        ${isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}
      `}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}