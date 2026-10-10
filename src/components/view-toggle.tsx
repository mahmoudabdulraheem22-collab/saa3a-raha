"use client";

import { useState } from "react";

export function ViewToggle({
  listLabel,
  mapLabel,
  list,
  map,
}: {
  listLabel: string;
  mapLabel: string;
  list: React.ReactNode;
  map: React.ReactNode;
}) {
  const [view, setView] = useState<"list" | "map">("list");
  return (
    <div>
      <div className="mb-4 flex gap-2" role="group">
        {(["list", "map"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={view === item}
            onClick={() => setView(item)}
            className={`h-10 rounded-full px-4 text-sm font-semibold ${view === item ? "bg-ink text-paper" : "border border-line bg-paper"}`}
          >
            {item === "list" ? listLabel : mapLabel}
          </button>
        ))}
      </div>
      {view === "list" ? list : map}
    </div>
  );
}
