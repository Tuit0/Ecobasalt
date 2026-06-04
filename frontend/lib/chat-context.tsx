"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ChatCtx = {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

const Ctx = createContext<ChatCtx | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider
      value={{
        open,
        show: () => setOpen(true),
        hide: () => setOpen(false),
        toggle: () => setOpen((v) => !v),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
