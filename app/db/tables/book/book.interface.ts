export interface NewBook {
  title: string;
  author: string;
  file_path: string;
  release_date: Date | null;
}

export interface Book extends NewBook {
  book_id: number;
}
