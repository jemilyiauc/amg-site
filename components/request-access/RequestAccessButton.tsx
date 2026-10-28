"use client";

import { useRequestAccess } from "./RequestAccessProvider";

export const RequestAccessButton = ({ label, className }: { label: string; className: string }) => {
  const { open } = useRequestAccess();

  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
    >
      {label}
    </a>
  );
};
