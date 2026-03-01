"use client";

interface CategoryPillsProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryPills({
  categories,
  selected,
  onSelect,
}: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 ${
          selected === null
            ? "bg-fc-accent text-white"
            : "bg-fc-surface-muted text-fc-brand hover:bg-fc-border border border-fc-border"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 ${
            selected === cat
              ? "bg-fc-accent text-white"
              : "bg-fc-surface-muted text-fc-brand hover:bg-fc-border border border-fc-border"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
