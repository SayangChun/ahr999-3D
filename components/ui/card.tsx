import type { ReactNode } from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border border-[#2a2a2a] bg-[#151515] p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
