// File: src/App.jsx
import { useState, useEffect } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';

// Build API URL from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const API_BOOK_URL = API_URL + '/books';

// App configuration
const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Book Manager';
const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE || 'Organize and track your personal book collection';

export default function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(API_BOOK_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'},
    })
      .then(res => res.json())
      .then(setBooks)
      .catch(console.error);
  }, []);

  const addBook = (book) => {
    fetch(API_BOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
      .then(() => fetch(API_BOOK_URL))
      .then(res => res.json())
      .then(setBooks)
      .catch(console.error);
  };

  const deleteBook = (id) => {
    fetch(`${API_BOOK_URL}/${id}`, { method: 'DELETE' })
      .then(() => fetch(API_BOOK_URL))
      .then(res => res.json())
      .then(setBooks)
      .catch(console.error);
  };

  // Calculate statistics
  // Handle case where backend returns books as a string instead of array
  let bookList = books?.books || [];
  if (typeof bookList === 'string') {
    try {
      bookList = JSON.parse(bookList);
    } catch {
      bookList = [];
    }
  }
  const totalBooks = bookList.length;
  const uniqueAuthors = new Set(bookList.map(book => book?.author).filter(Boolean)).size;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 {APP_TITLE}</h1>
        <p className="tagline">{APP_TAGLINE}</p>
      </header>

      {/* Statistics Dashboard */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{totalBooks}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{uniqueAuthors}</div>
          <div className="stat-label">Authors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{uniqueAuthors > 0 ? (totalBooks / uniqueAuthors).toFixed(1) : 0}</div>
          <div className="stat-label">Books per Author</div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="form-section">
          <h2><span className="emoji" aria-hidden="true">➕</span> Add New Book</h2>
          <p className="section-description">Enter book details to add to your collection</p>
          <BookForm onAdd={addBook} />
        </div>
        <div className="list-section">
          <h2><span className="emoji" aria-hidden="true">📖</span> My Library</h2>
          <p className="section-description">Books organized by author</p>
          <BookList books={books} onDelete={deleteBook} />
        </div>
      </div>
    </div>
  );
}