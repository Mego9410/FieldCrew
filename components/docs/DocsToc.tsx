interface DocsTocProps {
  items: Array<{ id: string; label: string }>;
}

export function DocsToc({ items }: DocsTocProps) {
  if (items.length === 0) return null;

  return (
    <aside className="space-y-3" aria-label="On this page">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fc-muted">On this page</h2>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-sm text-fc-muted hover:text-fc-accent">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
