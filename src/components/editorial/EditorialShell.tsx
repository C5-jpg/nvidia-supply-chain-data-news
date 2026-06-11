import type { ReactNode } from "react";

type EditorialShellProps = {
  children: ReactNode;
};

export function EditorialShell({ children }: EditorialShellProps) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </main>
  );
}
