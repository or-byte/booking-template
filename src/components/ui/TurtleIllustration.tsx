/**
 * A small cartoon sea turtle (a nod to the Pawikan Conservation Center down the
 * road) for friendly "not ready yet" moments. Drawn in the brand palette; the
 * swim and bubble motion lives in app.css and stops under reduced motion.
 *
 * Static rotations sit on wrapper groups so the CSS animations, which set their
 * own transform, never displace the shapes.
 */
export default function TurtleIllustration(props: { class?: string }) {
  return (
    <svg
      viewBox="0 0 180 130"
      class={props.class}
      role="img"
      aria-label="A cartoon sea turtle swimming"
    >
      {/* Water line */}
      <path
        d="M6 118c10 0 10-6 20-6s10 6 20 6 10-6 20-6 10 6 20 6 10-6 20-6 10 6 20 6 10-6 20-6 10 6 20 6"
        fill="none"
        stroke="#bfe0eb"
        stroke-width="3"
        stroke-linecap="round"
      />

      {/* Bubbles drift up from the turtle's nose */}
      <g fill="none" stroke="#9acbdc" stroke-width="2">
        <circle class="turtle-bubble" cx="164" cy="40" r="4" />
        <circle class="turtle-bubble turtle-bubble--late" cx="171" cy="27" r="2.6" />
        <circle class="turtle-bubble turtle-bubble--later" cx="162" cy="17" r="1.8" />
      </g>

      <g class="turtle-swim">
        {/* Back flipper and tail, behind the shell */}
        <g transform="rotate(-28 48 86)">
          <ellipse class="turtle-flipper-back" cx="48" cy="86" rx="16" ry="6.5" fill="#519eb8" />
        </g>
        <path d="M30 74 15 79l15 6Z" fill="#76b7cd" />

        {/* Neck, tucked under the shell edge */}
        <ellipse cx="134" cy="74" rx="14" ry="9" fill="#76b7cd" />

        {/* Shell */}
        <path d="M30 78C30 43 53 28 82 28s52 15 52 50Z" fill="#013183" />
        <path d="M26 78h112a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8Z" fill="#9acbdc" />
        <g fill="#2f5aa8">
          <path d="M70 42h24l9 15-9 15H70l-9-15Z" />
          <path d="M39 74c1-15 7-26 18-33l8 15-6 18Z" />
          <path d="M125 74c-1-15-7-26-18-33l-8 15 6 18Z" />
        </g>
        <path
          d="M48 42c8-7 19-10 30-10"
          fill="none"
          stroke="#ffffff"
          stroke-opacity="0.35"
          stroke-width="3"
          stroke-linecap="round"
        />

        {/* Front flipper */}
        <g transform="rotate(24 110 92)">
          <ellipse class="turtle-flipper-front" cx="110" cy="92" rx="19" ry="7" fill="#76b7cd" />
        </g>

        {/* Head, in front of everything */}
        <circle cx="150" cy="64" r="16" fill="#76b7cd" />
        <circle cx="142" cy="55" r="2" fill="#519eb8" />
        <circle cx="156" cy="52" r="1.6" fill="#519eb8" />
        <circle cx="154" cy="62" r="3.4" fill="#01225c" />
        <circle cx="155.2" cy="60.8" r="1.2" fill="#ffffff" />
        <path
          d="M151 70.5q4.5 3.5 9-0.5"
          fill="none"
          stroke="#01225c"
          stroke-width="2"
          stroke-linecap="round"
        />
        <circle cx="146.5" cy="69" r="3.2" fill="#ffb25c" opacity="0.75" />
      </g>
    </svg>
  );
}
