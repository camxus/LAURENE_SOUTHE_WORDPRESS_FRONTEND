"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, BookOpen } from "lucide-react";
import type { Book } from "@/lib/api";

const TRUNCATE_AT = 220;

export function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [descOpen, setDescOpen]           = useState(false);
  const [backCoverOpen, setBackCoverOpen] = useState(false);
  const [pdfOpen, setPdfOpen]             = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const title       = book.title.rendered.replace(/<[^>]+>/g, "");
  const desc        = book.description?.replace(/<[^>]+>/g, "").trim() ?? "";
  const isTruncated = desc.length > TRUNCATE_AT;

  return (
    <>
      {/* ── Main book modal ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 340, damping: 32, delay: 0.05 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-sm bg-void-2 border border-white/10 rounded-none overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-pearl/30 hover:text-pearl transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>

          {book.cover_image && (
            <div className="w-full aspect-[3/2] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.cover_image}
                alt={title}
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          )}

          <div className="p-7">
            {book.book_genre && (
              <p
                className="text-[10px] tracking-widest uppercase text-pearl-dim mb-3 font-body"
                style={{ letterSpacing: "0.2em" }}
              >
                {book.book_genre} {book.book_year ? `· ${book.book_year}` : ""}
              </p>
            )}

            <h2
              className="font-display text-2xl font-light text-pearl leading-tight"
              style={{ fontStyle: "italic" }}
            >
              {title}
            </h2>

            {book.book_author && (
              <p className="mt-1 text-xs text-pearl-dim font-body">{book.book_author}</p>
            )}

            {desc && (
              <p className="mt-5 text-sm text-pearl/60 font-body leading-relaxed">
                {isTruncated ? (
                  <>
                    {desc.slice(0, TRUNCATE_AT)}
                    {"… "}
                    <button
                      onClick={() => setDescOpen(true)}
                      className="inline text-accent hover:text-pearl underline underline-offset-2 decoration-dotted transition-colors duration-200 text-xs"
                    >
                      Show More
                    </button>
                  </>
                ) : (
                  desc
                )}
              </p>
            )}

            {/* Action row */}
            <div className="mt-7 flex flex-col gap-3">
              {!!book.back_cover_image && (
                <button
                  onClick={() => setBackCoverOpen(true)}
                  className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-pearl/40 hover:text-pearl transition-colors duration-200"
                  style={{ letterSpacing: "0.15em" }}
                >
                  <svg
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  Show Back Cover
                </button>
              )}

              {book.book_pdf && (
                <button
                  onClick={() => setPdfOpen(true)}
                  className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-accent hover:text-pearl transition-colors duration-200"
                  style={{ letterSpacing: "0.15em" }}
                >
                  <BookOpen size={13} strokeWidth={1.5} />
                  Read Now
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Full description modal ───────────────────────────── */}
      <AnimatePresence>
        {descOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            onClick={() => setDescOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 34, delay: 0.04 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md bg-void-2 border border-white/10 rounded-none p-8 max-h-[75vh] overflow-y-auto"
            >
              <button
                onClick={() => setDescOpen(false)}
                className="absolute top-4 right-4 text-pearl/30 hover:text-pearl transition-colors"
              >
                <X size={15} strokeWidth={1.5} />
              </button>

              <h3
                className="font-display text-lg font-light text-pearl mb-5 pr-6 leading-snug"
                style={{ fontStyle: "italic" }}
              >
                {title}
              </h3>

              <div className="w-8 h-px bg-accent/40 mb-5" />

              <p className="text-sm text-pearl/70 font-body leading-relaxed whitespace-pre-line">
                {desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Back cover modal ─────────────────────────────────── */}
      <AnimatePresence>
        {backCoverOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            onClick={() => setBackCoverOpen(false)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 360, damping: 34, delay: 0.04 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 max-w-xs w-full"
            >
              <button
                onClick={() => setBackCoverOpen(false)}
                className="absolute -top-8 right-0 text-pearl/30 hover:text-pearl transition-colors"
              >
                <X size={15} strokeWidth={1.5} />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.back_cover_image}
                alt={`${title} — back cover`}
                className="w-full h-auto block border border-white/10"
              />

              <p
                className="mt-3 text-center text-[10px] tracking-widest uppercase text-pearl/30 font-body"
                style={{ letterSpacing: "0.2em" }}
              >
                Back Cover
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PDF reader modal ─────────────────────────────────── */}
      <AnimatePresence>
        {pdfOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex flex-col"
            onClick={() => setPdfOpen(false)}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {/* Top bar */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-void-2/80 backdrop-blur-sm flex-shrink-0"
            >
              <p
                className="font-display text-sm font-light text-pearl/70 italic truncate max-w-[70%]"
              >
                {title}
              </p>

              <div className="flex items-center gap-4">
                {/* Download fallback */}
                <a
                  href={book.book_pdf}
                  download
                  className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-pearl/30 hover:text-pearl transition-colors font-body"
                  style={{ letterSpacing: "0.15em" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={12} strokeWidth={1.5} />
                  Download
                </a>

                <button
                  onClick={() => setPdfOpen(false)}
                  className="text-pearl/30 hover:text-pearl transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>

            {/* PDF embed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex-1 min-h-0"
            >
              <iframe
                src={`${book.book_pdf}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-full border-0"
                title={title}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
