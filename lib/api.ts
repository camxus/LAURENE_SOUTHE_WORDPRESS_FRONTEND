const WP_BASE = "https://srv1501677.hstgr.cloud/wp-json/wp/v2";

export interface Book {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;

  title: {
    rendered: string;
  };

  content: {
    rendered: string;
    protected: boolean;
  };

  description: string;

  featured_media: number;

  book_author: string;
  book_genre: string;
  book_year: number;

  book_pdf: string;
  download_count: number;
  cover_image: string;
}

export async function fetchBooks(): Promise<Book[]> {
  try {
    const res = await fetch(`${WP_BASE}/books?per_page=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
