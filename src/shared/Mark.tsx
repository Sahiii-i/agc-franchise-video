import { C } from "./tokens";

// The Apex mark, one path from agc-website/src/assets/brand/logo.svg.
const PATH =
  "M211.552 4.45888C157.331 12.3859 111.492 35.6569 74.3295 74.1239C-32.2806 184.479 -6.69086 367.373 126.065 443.883C141.985 453.058 153.015 457.725 173.341 463.887C194.448 470.286 206.205 472.623 224.702 474.097C244.928 475.709 268.295 474.037 289.387 469.467C305.522 465.971 331.322 455.188 350.102 444.092C352.98 442.391 355.764 441 356.289 441C356.859 441 357.243 447.855 357.243 458V475H410.63H464.017L464.013 343.75C464.01 231.717 463.788 211.109 462.505 203C455.793 160.58 438.901 122.179 412.585 89.5159C404.122 79.0099 385.81 60.8169 375.494 52.6649C348.027 30.9569 313.071 14.6339 278.756 7.49088C257.662 3.10088 229.528 1.83088 211.552 4.45888ZM210.055 96.5369C192.042 99.8619 172.591 107.853 156.732 118.445C147.01 124.938 131.136 140.294 123.222 150.861C111.402 166.644 102.076 187.562 97.6072 208.312C95.784 216.781 95.4118 221.705 95.4058 237.5C95.3989 254.788 95.6493 257.581 98.1869 268.5C104.882 297.31 117.052 319.508 137.128 339.533C174.024 376.333 226.175 389.028 275.852 373.302C315.856 360.638 349.715 327.369 364.193 286.5C382.803 233.97 370.175 175.461 331.797 136.401C312.712 116.977 290.383 104.365 263.453 97.7999C252.15 95.0439 222.004 94.3309 210.055 96.5369Z";

/**
 * draw 0..1 traces the outline, fill 0..1 fades the solid in over it.
 * The stroke is drawn with pathLength=1 so draw maps straight to the dash offset.
 */
export function Mark({ size, draw = 1, fill = 1, color = C.accent }: { size: number; draw?: number; fill?: number; color?: string }) {
  return (
    <svg width={size} height={size * (478 / 472)} viewBox="-10 -10 492 498" style={{ display: "block", overflow: "visible" }}>
      <path d={PATH} fill={color} fillRule="evenodd" clipRule="evenodd" opacity={fill} />
      {fill < 1 ? (
        <path
          d={PATH}
          fill="none"
          stroke={color}
          strokeWidth={10}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          opacity={1 - fill}
        />
      ) : null}
    </svg>
  );
}
