import type { ReactNode } from "react";

type SourceNoteProps = {
  children: ReactNode;
};

export function SourceNote({ children }: SourceNoteProps) {
  return <p className="source-note">{children}</p>;
}
