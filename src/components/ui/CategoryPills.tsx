import type { CatalogCategory } from "@/stores/catalog-store";

type CategoryPillsProps = {
  categories: CatalogCategory[];
  selected: string | null;
  onChange: (id: string | null) => void;
  className?: string;
  size?: "sm" | "md";
};

export function CategoryPills({
  categories,
  selected,
  onChange,
  className = "",
  size = "md",
}: CategoryPillsProps) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs";

  const pillClass = (active: boolean) =>
    `${pad} shrink-0 rounded-full border font-semibold transition-all ${
      active
        ? "border-zencarta-green bg-zencarta-green text-white shadow-md shadow-zencarta-green/20"
        : "border-slate-200 text-zencarta-navy hover:border-zencarta-green hover:text-zencarta-green dark:border-[#1f3524] dark:text-slate-100"
    }`;

  return (
    <div className={`no-scrollbar flex gap-2 overflow-x-auto pb-1 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(null)}
        className={pillClass(selected === null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={pillClass(selected === cat.id)}
        >
          {cat.icon && <span className="mr-1">{cat.icon}</span>}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
