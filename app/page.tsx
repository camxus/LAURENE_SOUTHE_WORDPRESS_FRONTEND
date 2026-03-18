"use client"

import { Book, fetchBooks } from "@/lib/api";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";

export default function HomePage() {

  const [books, setBooks] = useState<Book[]>([])
  useEffect(() => {
    fetchBooks().then(books => setBooks(books));
  }, [])
  return <SiteShell books={books} />;
}
