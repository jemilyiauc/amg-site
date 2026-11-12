"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type RequestAccessContextValue = {
  // Whether the form is turned on in Sanity.
  enabled: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const RequestAccessContext = createContext<RequestAccessContextValue | null>(null);

export const RequestAccessProvider = ({ enabled, children }: { enabled: boolean; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ enabled, isOpen, open, close }), [enabled, isOpen, open, close]);

  return <RequestAccessContext.Provider value={value}>{children}</RequestAccessContext.Provider>;
};

export const useRequestAccess = (): RequestAccessContextValue => {
  const context = useContext(RequestAccessContext);
  if (!context) throw new Error("useRequestAccess must be used inside RequestAccessProvider");
  return context;
};
