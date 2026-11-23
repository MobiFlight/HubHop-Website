// the hub-and-spoke sphere of the HubHop logo; arrows flow into the hub
const nodes = [
  { cx: 86, cy: 60, r: 26 },
  { cx: 352, cy: 70, r: 24 },
  { cx: 54, cy: 236, r: 22 },
  { cx: 364, cy: 300, r: 22 },
  { cx: 132, cy: 356, r: 24 },
]
const arrows = [
  "M96 70 L165 140",
  "M340 80 L265 145",
  "M70 230 L135 210",
  "M350 290 L272 245",
  "M140 340 L182 268",
]

const light = "color-mix(in oklab, var(--primary) 55%, white)"
const dark = "color-mix(in oklab, var(--primary) 75%, black)"

const HubGraphic = () => (
  <svg
    role="img"
    aria-label="HubHop hub: community presets flowing into one shared catalog"
    viewBox="0 0 420 400"
    className="h-auto w-full max-w-56 text-primary md:max-w-md"
  >
    <defs>
      <radialGradient id="hub-sphere" cx="38%" cy="32%" r="70%">
        <stop offset="0" style={{ stopColor: light }} />
        <stop offset="0.55" style={{ stopColor: "var(--primary)" }} />
        <stop offset="1" style={{ stopColor: dark }} />
      </radialGradient>
      <radialGradient id="hub-node" cx="38%" cy="32%" r="70%">
        <stop offset="0" style={{ stopColor: light }} />
        <stop offset="1" style={{ stopColor: dark }} />
      </radialGradient>
    </defs>
    <circle
      cx="210"
      cy="200"
      r="150"
      fill="none"
      className="stroke-border"
      strokeDasharray="2 8"
    />
    <g
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity="0.85"
    >
      {arrows.map((d) => (
        <path
          key={d}
          d={d}
          strokeDasharray="6 6"
          className="motion-safe:animate-flow"
        />
      ))}
    </g>
    <circle cx="210" cy="200" r="78" fill="url(#hub-sphere)" />
    {nodes.map((node) => (
      <circle key={`${node.cx}-${node.cy}`} {...node} fill="url(#hub-node)" />
    ))}
  </svg>
)

export default HubGraphic
