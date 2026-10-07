import { categoryLabel, type CategoryValue } from "@/lib/forum";

const styles: Record<CategoryValue, string> = {
  QUESTION: "border-line text-primary",
  NOTICE: "border-primary bg-primary text-white",
  INCIDENT: "border-ink bg-ink text-white",
};

export default function CategoryBadge({
  category,
}: {
  category: CategoryValue;
}) {
  return (
    <span
      className={`inline-block border px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] ${styles[category]}`}
    >
      {categoryLabel(category)}
    </span>
  );
}
