import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center pt-24">
      <div className="shell text-center">
        <p className="font-display text-7xl text-gradient">404</p>
        <h1 className="mt-4 font-display text-3xl text-charcoal">
          This page wandered off
        </h1>
        <p className="mt-3 text-charcoal/65">
          The story you&apos;re looking for isn&apos;t here — but plenty more are.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal-soft"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
