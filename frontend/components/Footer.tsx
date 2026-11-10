import { CONTACT } from "@/content/story";
import Link from "next/link";
import { Mark } from "@/components/Mark";

export function Footer() {
  return (
    <footer className="rule-top px-4 py-16 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="flex w-fit items-center gap-3 transition-opacity hover:opacity-80">
            <Mark className="h-7 w-7 text-aim" title="Centaim home" />
            <span className="font-display text-lg tracking-tight text-paper">Centaim</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-faint">
            Websites and custom business systems, built to hit a named target.
          </p>
        </div>

        <nav aria-label="Sections">
          <ul className="flex flex-wrap gap-x-7 gap-y-2.5 text-sm text-faint">
            {/* "/" rather than "/#hero": in the scroll-story render the hero is
                an overlay panel with no DOM id, so a hash would land nowhere.
                The route's own top is the hero, in both renders. */}
            <li>
              <Link href="/" className="transition-colors hover:text-paper">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-paper">
                About
              </Link>
            </li>
            <li>
              <Link href="/demo" className="transition-colors hover:text-paper">
                Demo
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="transition-colors hover:text-paper">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-14 flex w-full max-w-6xl flex-col gap-2 text-sm text-faint sm:flex-row sm:justify-between">
        <p>
          <a href={CONTACT.phone.href} className="hover:text-paper">
            {CONTACT.phone.display}
          </a>
          <span className="mx-3 text-gunmetal-rim" aria-hidden>
            ·
          </span>
          <a href={CONTACT.email.href} className="hover:text-paper">
            {CONTACT.email.display}
          </a>
          <span className="mx-3 text-gunmetal-rim" aria-hidden>
            ·
          </span>
          {/* Off-site, so it opens in its own tab — and `noreferrer` keeps the
              new tab from reaching back into this one. */}
          <a
            href={CONTACT.github.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-paper"
          >
            {CONTACT.github.display}
          </a>
        </p>
        <p>© {new Date().getFullYear()} Centaim</p>
      </div>
    </footer>
  );
}
