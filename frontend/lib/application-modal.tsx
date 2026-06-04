"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Ctx = {
  open: boolean;
  preselectProduct?: string;
  preselectMessage?: string;
  show: (product?: string, message?: string) => void;
  hide: () => void;
};

const ApplicationModalCtx = createContext<Ctx | null>(null);

export function ApplicationModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preselectProduct, setPre] = useState<string | undefined>();
  const [preselectMessage, setPreMsg] = useState<string | undefined>();

  return (
    <ApplicationModalCtx.Provider
      value={{
        open,
        preselectProduct,
        preselectMessage,
        show: (product, message) => {
          setPre(product);
          setPreMsg(message);
          setOpen(true);
        },
        hide: () => setOpen(false),
      }}
    >
      {children}
    </ApplicationModalCtx.Provider>
  );
}

export function useApplicationModal() {
  const ctx = useContext(ApplicationModalCtx);
  if (!ctx) throw new Error("useApplicationModal must be used within ApplicationModalProvider");
  return ctx;
}
