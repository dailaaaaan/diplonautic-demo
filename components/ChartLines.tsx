// Curvas de profundidad de carta náutica, usadas solo como textura de fondo.
// El color y la opacidad los decide quien lo usa, con "className".
export default function ChartLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M-50 330 C 200 250, 380 380, 620 300 S 1020 210, 1250 290" />
      <path d="M-50 270 C 220 180, 400 320, 640 235 S 1000 140, 1250 220" />
      <path d="M-50 205 C 240 110, 420 255, 660 170 S 990 70, 1250 150" />
      <path d="M-50 140 C 260 45, 440 190, 680 105 S 980 5, 1250 80" />
      <path d="M-50 75 C 280 -20, 460 125, 700 40 S 970 -60, 1250 10" />
    </svg>
  );
}
