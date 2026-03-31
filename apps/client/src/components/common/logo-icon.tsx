import * as React from "react"

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  width = 36,
  height = 36,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Syncboard Logo Icon"
    {...props}
  >
    {/* Canvas background */}
    <rect
      x="3"
      y="8"
      width="30"
      height="20"
      rx="6"
      fill="#F2F4F8"
      stroke="#B5BEDD"
      strokeWidth="2"
    />
    {/* Eraser shape */}
    <rect
      x="16"
      y="14"
      width="12"
      height="8"
      rx="2.5"
      transform="rotate(30 16 14)"
      fill="#597EF7"
      stroke="#2343AA"
      strokeWidth="1.5"
      filter="url(#shadow)"
    />
    {/* Eraser highlight */}
    <rect
      x="19"
      y="16"
      width="5"
      height="1"
      rx="0.5"
      transform="rotate(30 19 16)"
      fill="#FFF"
      opacity="0.4"
    />
    {/* "Sync" pulse */}
    <path
      d="M11 20c0-2.5 2-4.5 4.5-4.5"
      stroke="#8C99C8"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="2 2"
      opacity="0.75"
    />
    <defs>
      <filter
        id="shadow"
        x="13"
        y="12"
        width="18"
        height="14"
        filterUnits="userSpaceOnUse"
      >
        <feDropShadow
          dy="1"
          stdDeviation="1"
          floodColor="#2343AA"
          floodOpacity="0.08"
        />
      </filter>
    </defs>
  </svg>
)

export default LogoIcon
