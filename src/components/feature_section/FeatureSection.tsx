import { JSX } from "solid-js";
import Reveal from "~/components/ui/Reveal";
import SectionHeading from "~/components/ui/SectionHeading";

type FeatureSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  /** Background utility for the section band, e.g. "bg-sand-100". */
  bgClass?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  class?: string;
  children: JSX.Element;
};

/**
 * A titled band of content. Sections alternate between the white and sand
 * grounds so the page reads as a stack of distinct rooms rather than one long
 * scroll.
 */
export default function FeatureSection(props: FeatureSectionProps) {
  return (
    <section id={props.id} class={`section ${props.bgClass ?? "bg-white"}`}>
      <div class="shell">
        <SectionHeading
          eyebrow={props.eyebrow}
          title={props.title}
          description={props.description}
          linkHref={props.linkHref}
          linkLabel={props.linkLabel}
          align={props.align}
          tone={props.tone}
        />

        <Reveal delay={120} class={`mt-12 md:mt-14 ${props.class ?? ""}`}>
          {props.children}
        </Reveal>
      </div>
    </section>
  );
}
