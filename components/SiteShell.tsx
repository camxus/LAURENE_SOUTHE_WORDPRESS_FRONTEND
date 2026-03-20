"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Book } from "@/lib/api";
import { BookModal } from "./BookModal";

/* ── helpers ─────────────────────────────────────────────── */
const SECTIONS = ["home", "books", "contact"] as const;
type Section = (typeof SECTIONS)[number];

const NAV_LABELS: Record<Section, string> = {
  home: "About",
  books: "Books",
  contact: "Contact",
};

/* ── component ───────────────────────────────────────────── */
export function SiteShell({ books }: { books: Book[] }) {
  const [active, setActive] = useState<Section>("home");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const refs = {
    home: useRef<HTMLElement>(null),
    books: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  };

  /* track active section via IntersectionObserver */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as Section);
        });
      },
      { threshold: 0.5 }
    );
    SECTIONS.forEach((id) => {
      if (refs[id].current) obs.observe(refs[id].current!);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollTo(id: Section) {
    refs[id].current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ── Sticky nav ──────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 h-12 border-b border-white/10 bg-void/90 backdrop-blur-md">
        {(["home", "books", "contact"] as Section[]).map((id) => (
          <NavItem
            key={id}
            label={NAV_LABELS[id]}
            active={active === id}
            onClick={() => scrollTo(id)}
          />
        ))}
      </nav>

      {/* ── Sections ────────────────────────────────────────── */}
      <main>
        <HomeSection ref={refs.home} />
        <BooksSection ref={refs.books} books={books} onSelect={setSelectedBook} />
        <ContactSection ref={refs.contact} />
      </main>

      {/* ── Book detail modal ────────────────────────────────── */}
      <AnimatePresence>
        {selectedBook && (
          <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-24 relative text-xs tracking-widest uppercase font-body transition-colors duration-300"
      style={{ color: active ? "#f0ede8" : "#6b6b6b", letterSpacing: "0.15em" }}
    >
      <span className="relative inline-block">
        {label}
        {active && (
          <motion.span
            layoutId="nav-dot"
            className="absolute -bottom-[1px] left-0 right-0 h-px bg-pearl"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   HOME SECTION
══════════════════════════════════════════════════════════ */
import { forwardRef } from "react";

const HomeSection = forwardRef<HTMLElement>((_, ref) => (
  <section
    id="home"
    ref={ref}
    className="relative flex flex-col items-center justify-center min-h-svh bg-void pt-12"
  >
    {/* Subtle radial glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,213,176,0.06) 0%, transparent 70%)",
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-center px-8 max-w-md"
    >
      {/* Thin horizontal rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-8 h-px bg-accent mx-auto mb-8 origin-center"
      />

      <h1
        className="font-display text-5xl sm:text-6xl font-light tracking-tight text-pearl leading-none"
        style={{ fontStyle: "italic" }}
      >
        Laurène
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8 text-sm text-pearl-dim leading-relaxed font-body font-light"
      >
        A writer in every from written.
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-8 h-px bg-accent mx-auto mt-8 origin-center"
      />
    </motion.div>
  </section>
));
HomeSection.displayName = "HomeSection";

/* ══════════════════════════════════════════════════════════
   BOOKS SECTION
══════════════════════════════════════════════════════════ */
const BooksSection = forwardRef<
  HTMLElement,
  { books: Book[]; onSelect: (b: Book) => void }
>(({ books, onSelect }, ref) => (
  <section
    id="books"
    ref={ref}
    className="min-h-svh bg-void pt-12 pb-16"
  >
    <div className="max-w-lg mx-auto px-6 pt-10">
      {/* Section heading */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest text-pearl-dim uppercase mb-10 text-center font-body"
        style={{ letterSpacing: "0.2em" }}
      >
        Books
      </motion.p>

      {books.length === 0 ? (
        <p className="text-center text-pearl-dim text-sm">No books found</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12">
          {books.map((book, i) => (
            <BookTile key={book.id} book={book} index={i} onClick={() => onSelect(book)} />
          ))}
        </div>
      )}
    </div>
  </section>
));
BooksSection.displayName = "BooksSection";

/* ── Single book tile ─────────────────────────────────────── */
function BookTile({
  book,
  index,
  onClick,
}: {
  book: Book;
  index: number;
  onClick: () => void;
}) {
  const title = book.title.rendered.replace(/<[^>]+>/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <button onClick={onClick} className="group w-full flex flex-col items-center">
        {/* Cover frame — mimics wireframe exactly */}
        <div className="relative w-full aspect-[2/3] border border-white/20 group-hover:border-accent/60 transition-colors duration-400 overflow-hidden bg-void-3">

          {book.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.cover_image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          ) : (
            /* Placeholder matching wireframe */
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/20 text-xs font-body tracking-widest uppercase">
                Cover
              </span>
            </div>
          )}

          {/* Hover vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        </div>

        {/* Title + author below cover */}
        <div className="mt-3 text-center">
          <p
            className="font-display text-base font-light text-pearl leading-snug group-hover:text-accent transition-colors duration-300"
            style={{ fontStyle: "italic" }}
          >
            {title}
          </p>
          {book.book_author && (
            <p className="mt-0.5 text-[11px] font-body text-pearl-dim tracking-wide">
              {book.book_author}
            </p>
          )}
        </div>
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTACT SECTION
══════════════════════════════════════════════════════════ */
const ContactSection = forwardRef<HTMLElement>((_, ref) => (
  <section
    id="contact"
    ref={ref}
    className="min-h-svh bg-void flex flex-col items-center justify-center pt-12 pb-16 px-8"
  >
    {/* Subtle radial */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(232,213,176,0.04) 0%, transparent 70%)",
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center gap-12"
    >
      <p
        className="text-xs tracking-widest text-pearl-dim uppercase font-body"
        style={{ letterSpacing: "0.2em" }}
      >
        Contact
      </p>

      <div className="flex gap-16 sm:gap-24">
        {/* Instagram */}
        <a
          href="https://instagram.com/laurenesouthe"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-14 h-14 border border-white/20 group-hover:border-accent/50 flex items-center justify-center transition-colors duration-300"
          >
            <InstagramIcon />
          </motion.div>
          <span className="text-xs text-pearl-dim group-hover:text-pearl transition-colors duration-200 font-body tracking-widest uppercase"
                style={{ letterSpacing: "0.12em" }}>
            Instagram
          </span>
        </a>

        {/* Email */}
        <a
          href="mailto:laurene.southe@gmail.com"
          className="group flex flex-col items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-14 h-14 border border-white/20 group-hover:border-accent/50 flex items-center justify-center transition-colors duration-300"
          >
            <MailIcon />
          </motion.div>
          <span className="text-xs text-pearl-dim group-hover:text-pearl transition-colors duration-200 font-body tracking-widest uppercase"
                style={{ letterSpacing: "0.12em" }}>
            Email
          </span>
        </a>
      </div>

      {/* Signature */}
      <p
        className="font-display text-md font-light text-pearl/30 mt-4"
        style={{ fontStyle: "italic" }}
      >
        Laurène
      </p>
    </motion.div>
  </section>
));
ContactSection.displayName = "ContactSection";

/* ── Icons ─────────────────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         className="text-pearl/60 group-hover:text-accent transition-colors duration-300">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         className="text-pearl/60 group-hover:text-accent transition-colors duration-300">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}
