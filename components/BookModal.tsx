"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Download } from "lucide-react";
import type { Book } from "@/lib/api";

export function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const title = book.title.rendered.replace(/<[^>]+>/g, "");
  const desc = book.description?.replace(/<[^>]+>/g, "").trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-end items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 340, damping: 32, delay: 0.05 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-sm bg-void-2 border border-white/10 rounded-none overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-pearl/30 hover:text-pearl transition-colors"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        {/* Cover */}
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

        {/* Content */}
        <div className="p-7">
          {book.book_genre && (
            <p className="text-[10px] tracking-widest uppercase text-pearl-dim mb-3 font-body"
               style={{ letterSpacing: "0.2em" }}>
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
              {desc.length > 220 ? desc.slice(0, 220) + "…" : desc}
            </p>
          )}

          {book.book_pdf && (
            <a
              href={book.book_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex items-center gap-2 text-xs font-body tracking-widest uppercase text-accent hover:text-pearl transition-colors duration-200"
              style={{ letterSpacing: "0.15em" }}
            >
              <Download size={13} strokeWidth={1.5} />
              Read Now
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
