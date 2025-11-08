import { useState, useMemo } from 'react';

export default function BookList({ books, onDelete }) {
  const [expandedAuthors, setExpandedAuthors] = useState(new Set());

  // Group books by author
  const booksByAuthor = useMemo(() => {
    if (!books || !books.books) {
      return {};
    }

    let bookList = books.books;
    if (typeof bookList === 'string') {
      try {
        bookList = JSON.parse(bookList);
      } catch {
        return {};
      }
    }

    if (!Array.isArray(bookList) || bookList.length === 0) {
      return {};
    }

    const grouped = {};
    bookList.forEach((book) => {
      if (book && book.author) {
        if (!grouped[book.author]) {
          grouped[book.author] = [];
        }
        grouped[book.author].push(book);
      }
    });
    return grouped;
  }, [books]);

  const authors = Object.keys(booksByAuthor).sort();

  if (authors.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <p className="no-books">No books available yet.</p>
        <p className="empty-hint">Start building your library by adding a book above!</p>
      </div>
    );
  }

  const toggleAuthor = (author) => {
    const newExpanded = new Set(expandedAuthors);
    if (newExpanded.has(author)) {
      newExpanded.delete(author);
    } else {
      newExpanded.add(author);
    }
    setExpandedAuthors(newExpanded);
  };

  return (
    <div className="book-list">
      {authors.map((author) => {
        const isExpanded = expandedAuthors.has(author);
        const authorBooks = booksByAuthor[author];
        const bookCount = authorBooks.length;

        return (
          <div key={author} className="author-group">
            <button 
              className="author-header"
              onClick={() => toggleAuthor(author)}
            >
              <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
              <span className="author-name">{author}</span>
              <span className="book-count">({bookCount} {bookCount === 1 ? 'book' : 'books'})</span>
            </button>
            
            {isExpanded && (
              <ul className="books-sublist">
                {authorBooks.map((book, index) => (
                  <li key={book.id} className="book-item">
                    <div className="book-details">
                      <span className="book-number">#{index + 1}</span>
                      <span className="book-title">{book.title}</span>
                    </div>
                    <button 
                      onClick={() => onDelete(book.id)} 
                      className="delete-btn"
                      title="Remove this book"
                    >
                      🗑️ Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}