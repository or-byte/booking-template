import { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * A small hand-picked icon set drawn on a single 24px grid with a consistent
 * 1.5px stroke, so amenity rows and contact lines stay optically even. Kept
 * inline rather than pulled from an icon package: it is a dozen glyphs, and
 * matching stroke weight across packages is more work than drawing them.
 */

const paths: Record<string, () => JSX.Element> = {
  wifi: () => (
    <>
      <path d="M2 8.5a16 16 0 0 1 20 0" />
      <path d="M5 12a11.5 11.5 0 0 1 14 0" />
      <path d="M8.5 15.5a7 7 0 0 1 7 0" />
      <path d="M12 19h.01" />
    </>
  ),
  pool: () => (
    <>
      <path d="M2 17.5c1.6 0 1.6 1.2 3.2 1.2s1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2" />
      <path d="M7 15V5.5A2.5 2.5 0 0 1 12 5.5" />
      <path d="M17 15V5.5" />
      <path d="M7 9.5h10" />
    </>
  ),
  dining: () => (
    <>
      <path d="M6 3v8a2 2 0 0 0 4 0V3" />
      <path d="M8 11v10" />
      <path d="M17 3c-1.5 1.5-2 3.5-2 5.5S15.5 12 17 12v9" />
    </>
  ),
  parking: () => (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M10 17V7.5h3.2a2.9 2.9 0 0 1 0 5.8H10" />
    </>
  ),
  aircon: () => (
    <>
      <rect x="2.5" y="4" width="19" height="8" rx="2.5" />
      <path d="M6 8.5h12" />
      <path d="M7 15v1.5M12 15v3M17 15v1.5" />
    </>
  ),
  beach: () => (
    <>
      <path d="M12 4a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8Z" />
      <path d="M12 12v8" />
      <path d="M9.5 20h5" />
    </>
  ),
  service: () => (
    <>
      <path d="M3 18h18" />
      <path d="M4.5 18a7.5 7.5 0 0 1 15 0" />
      <path d="M12 7V5" />
      <path d="M10 5h4" />
    </>
  ),
  bar: () => (
    <>
      <path d="M4 4h16l-8 8Z" />
      <path d="M12 12v7" />
      <path d="M8.5 19h7" />
    </>
  ),
  events: () => (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
      <path d="M8.5 14.5h3v3h-3z" />
    </>
  ),
  spa: () => (
    <>
      <path d="M12 21c0-5 2.5-9 8-11-1 6-4 9-8 11Z" />
      <path d="M12 21C12 16 9.5 12 4 10c1 6 4 9 8 11Z" />
      <path d="M12 21v-4" />
    </>
  ),
  phone: () => (
    <path d="M5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2 4 1.5v3A2 2 0 0 1 16.4 19 14.5 14.5 0 0 1 5 7.6 2 2 0 0 1 5 3.5Z" />
  ),
  mail: () => (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  pin: () => (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  globe: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  clock: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  plane: () => <path d="M10.5 20.5 12 15l7.5-2.5 1.5-3-8 2-3.5-4h-2l1.5 5-3.5 1L4 11H2.5l1.5 4-1.5 4H4l1.5-2.5 3.5 1Z" />,
  car: () => (
    <>
      <path d="M4 16v2.5M20 16v2.5" />
      <path d="M3 16v-3.2l1.8-4.3A2.5 2.5 0 0 1 7.1 7h9.8a2.5 2.5 0 0 1 2.3 1.5L21 12.8V16Z" />
      <path d="M3 12.8h18" />
      <circle cx="7.5" cy="16" r="0.8" />
      <circle cx="16.5" cy="16" r="0.8" />
    </>
  ),
  bed: () => (
    <>
      <path d="M3 18V6" />
      <path d="M3 11h11a4 4 0 0 1 4 4v3" />
      <path d="M21 18v-3" />
      <path d="M3 15h18" />
      <circle cx="7.5" cy="8.5" r="1.8" />
    </>
  ),
  users: () => (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <path d="M16 5.4a3.2 3.2 0 0 1 0 5.2" />
      <path d="M17.5 13.6A6 6 0 0 1 21 19" />
    </>
  ),
  expand: () => (
    <>
      <path d="M4 9V4h5" />
      <path d="M20 15v5h-5" />
      <path d="M15 4h5v5" />
      <path d="M9 20H4v-5" />
    </>
  ),
  check: () => <path d="m4.5 12.5 5 5 10-11" />,
  arrowRight: () => (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  chevronDown: () => <path d="m6 9.5 6 6 6-6" />,
  facebook: () => (
    <path d="M14.5 8.5H17V5.2h-2.6c-2.4 0-3.9 1.6-3.9 4v1.6H8v3.3h2.5V21h3.4v-6.9h2.4l.4-3.3h-2.8V9.6c0-.7.2-1.1 1.1-1.1Z" />
  ),
  instagram: () => (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M16.9 7.1h.01" />
    </>
  ),
  tiktok: () => (
    <path d="M14 3.5v10.9a3.1 3.1 0 1 1-2.6-3.05V8.1A6.1 6.1 0 1 0 17 14.4V9.6a6.4 6.4 0 0 0 3.5 1.05V7.6A3.6 3.6 0 0 1 17 4v-.5Z" />
  ),
};

export type IconName = keyof typeof paths;

type IconProps = {
  name: IconName;
  size?: number;
  class?: string;
  /** Solid fills (social marks) skip the stroke treatment. */
  filled?: boolean;
};

export default function Icon(props: IconProps) {
  const filled = () => props.filled ?? ["facebook", "tiktok"].includes(props.name);

  return (
    <svg
      viewBox="0 0 24 24"
      width={props.size ?? 20}
      height={props.size ?? 20}
      fill={filled() ? "currentColor" : "none"}
      stroke={filled() ? "none" : "currentColor"}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.class}
      aria-hidden="true"
      focusable="false"
    >
      <Dynamic component={paths[props.name]} />
    </svg>
  );
}
