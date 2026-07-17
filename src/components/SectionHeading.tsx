import { RevealText } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "text-center mx-auto" : "text-left"} max-w-2xl ${
        align === "center" ? "flex flex-col items-center" : ""
      } ${className}`}
    >
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight text-charcoal">
        <RevealText text={title} />
      </h2>
    </div>
  );
}
