"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type NavLink = { label: string; href: string };

const FALLBACK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

type NavbarProps = {
  logo?: string;
  links?: NavLink[];
};

export function Navbar({ logo = "Manju KC", links = FALLBACK_LINKS }: NavbarProps) {
  const safeLinks = Array.isArray(links) ? links : FALLBACK_LINKS;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-soft" : "bg-transparent"
        }`}
      >
        <nav className="shell flex items-center justify-between h-20">
          <Link href="/" className="group flex items-center gap-2" aria-label={logo}>
            <span className="grid place-items-center w-9 h-9 rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ffd93d,#ff8fa3)] text-white text-sm font-display">
              M
            </span>
            <span className="font-display text-xl tracking-tight text-charcoal">
              {logo}
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-9">
            {safeLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors"
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-px bg-[linear-gradient(90deg,#ff6b6b,#ff8fa3)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal-soft transition-colors"
            >
              Let&apos;s Talk
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden grid place-items-center w-11 h-11 rounded-full glass"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block w-5 h-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-charcoal transition-transform ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-5 bg-charcoal transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-0.5 w-5 bg-charcoal transition-transform ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 md:hidden bg-blush"
          >
            <ul className="h-full flex flex-col items-center justify-center gap-7">
              {safeLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl text-charcoal"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
