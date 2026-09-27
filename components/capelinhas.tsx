const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Layer = "far" | "mid" | "near";

type Capelinha = {
  name: string;
  /** Resting position, in % of the viewport. */
  x: number;
  y: number;
  layer: Layer;
  /** Drift distance (px), loop duration and phase (s), resting tilt (deg). */
  dx: number;
  dy: number;
  duration: number;
  delay: number;
  tilt: number;
  /** Hide on small screens to keep phones uncluttered. */
  desktopOnly?: boolean;
};

// Hand-placed so they spread around the edges and peek between content.
const capelinhas: Capelinha[] = [
  { name: "santa bety", x: 4, y: 14, layer: "near", dx: 60, dy: 50, duration: 46, delay: -8, tilt: -6 },
  { name: "santa elsa", x: 88, y: 9, layer: "mid", dx: -50, dy: 40, duration: 52, delay: -20, tilt: 5 },
  { name: "santa elsa returns", x: 92, y: 47, layer: "near", dx: -70, dy: 60, duration: 58, delay: -33, tilt: 8, desktopOnly: true },
  { name: "santa estornilda", x: 2, y: 56, layer: "mid", dx: 55, dy: -45, duration: 49, delay: -12, tilt: -4, desktopOnly: true },
  { name: "santa ivone", x: 47, y: 5, layer: "far", dx: 80, dy: 35, duration: 64, delay: -41, tilt: 3 },
  { name: "santa maratonia", x: 71, y: 30, layer: "far", dx: -60, dy: 50, duration: 61, delay: -5, tilt: -7, desktopOnly: true },
  { name: "santa prolongina", x: 9, y: 86, layer: "far", dx: 70, dy: -40, duration: 57, delay: -27, tilt: 6 },
  { name: "santa ruína", x: 81, y: 79, layer: "mid", dx: -45, dy: -55, duration: 50, delay: -16, tilt: -5 },
  { name: "santa skinaria", x: 31, y: 38, layer: "far", dx: 50, dy: 60, duration: 67, delay: -52, tilt: 4, desktopOnly: true },
  { name: "santa vitrolina", x: 58, y: 88, layer: "near", dx: -65, dy: -45, duration: 55, delay: -38, tilt: 7, desktopOnly: true },
  { name: "seu ferreira", x: 22, y: 70, layer: "mid", dx: 60, dy: -50, duration: 53, delay: -24, tilt: -8 },
];

const layerClass: Record<Layer, string> = {
  far: "w-9 sm:w-11 opacity-25 blur-[1px]",
  mid: "w-12 sm:w-16 opacity-40",
  near: "w-14 sm:w-[5.5rem] opacity-45",
};

const src = (name: string) => `${basePath}/live/capelinhas/${encodeURIComponent(`${name} 112`)}.png`;

/** The stream's capelinhas drifting behind the page. Purely decorative. */
export function Capelinhas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden" aria-hidden>
      {capelinhas.map((c) => (
        <div
          key={c.name}
          className={`capelinha absolute ${c.desktopOnly ? "hidden sm:block" : ""}`}
          style={
            {
              left: `${c.x}%`,
              top: `${c.y}%`,
              "--dx": `${c.dx}px`,
              "--dy": `${c.dy}px`,
              "--tilt": `${c.tilt}deg`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny static decoration, no optimization needed */}
          <img
            src={src(c.name)}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            className={`capelinha-bob h-auto select-none ${layerClass[c.layer]}`}
            style={{ animationDelay: `${c.delay / 7}s` }}
          />
        </div>
      ))}
    </div>
  );
}
