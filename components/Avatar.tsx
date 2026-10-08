import { getInitials } from "@/lib/initials";

// Cuadro con las iniciales de un usuario: "Marc Soler" se muestra como "MS".
export default function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-primary font-mono text-xs text-white"
    >
      {getInitials(name)}
    </span>
  );
}
