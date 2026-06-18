import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-[rgba(255,215,0,0.12)]">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#FFD700] font-mono mb-3 px-2.5 py-1 rounded-full border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFEA00] shadow-[0_0_8px_#FFEA00]" />
              {eyebrow}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            <span className="gold-text">{title}</span>
          </h1>
          {description && (
            <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
