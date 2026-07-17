"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type FooterProps = {
  logo?: string;
  socials?: { platform: string; url: string }[];
};

const FALLBACK_SOCIALS = [
  { platform: "Instagram", url: "https://instagram.com/manju.kc" },
  { platform: "LinkedIn", url: "https://linkedin.com/in/manjukc" },
];

export function Footer({ logo = "Manju KC", socials = FALLBACK_SOCIALS }: FooterProps) {
  const safeSocials = Array.isArray(socials) ? socials : FALLBACK_SOCIALS;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
  }

  return (
    <footer className="relative mt-24 bg-charcoal text-ivory overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,#ff8fa3_0%,transparent_70%)] opacity-30" />
      <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[radial-gradient(circle,#ffd93d_0%,transparent_70%)] opacity-20" />

      <div className="shell relative grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="font-display text-2xl">
            {logo}
          </Link>
          <p className="mt-4 max-w-sm text-ivory/70 leading-relaxed">
            Brand stories that move people. Marketing that feels human — crafted
            between Brisbane and Bhaktapur.
          </p>

          <form onSubmit={subscribe} className="mt-6 flex max-w-sm gap-2">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email for gentle letters"
              className="flex-1 rounded-full bg-white/10 px-5 py-3 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:ring-2 focus:ring-rose/60"
            />
            <button
              type="submit"
              className="rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] px-5 py-3 text-sm font-medium text-white transition-shadow hover:shadow-lift"
            >
              Join
            </button>
          </form>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-sage-soft"
            >
              Welcome — your first letter is on its way. 💌
            </motion.p>
          )}
        </div>

        <div>
          <h3 className="font-display text-lg">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-ivory/70">
            <li><Link href="/about" className="hover:text-ivory">About</Link></li>
            <li><Link href="/portfolio" className="hover:text-ivory">Work</Link></li>
            <li><Link href="/services" className="hover:text-ivory">Services</Link></li>
            <li><Link href="/blog" className="hover:text-ivory">Journal</Link></li>
            <li><Link href="/contact" className="hover:text-ivory">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg">Say hello</h3>
          <ul className="mt-4 space-y-2 text-sm text-ivory/70">
            {safeSocials.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ivory transition-colors"
                >
                  {s.platform}
                </a>
              </li>
            ))}
            <li>
              <a href="mailto:manju.australia05@gmail.com" className="hover:text-ivory">
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell relative border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/50">
        <p>© {new Date().getFullYear()} {logo}. Made with warmth.</p>
        <p>Not corporate. Just human.</p>
      </div>
    </footer>
  );
}
