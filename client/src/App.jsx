// File: src/App.jsx
import { useState, useEffect } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';

// Build API URL from environment variables
const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '3001';
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/books';
const portStr = API_PORT && API_PORT !== '80' && API_PORT !== '443' ? `:${API_PORT}` : '';
const apiUrl = `${API_PROTOCOL}://${API_HOST}${portStr}${API_BASE_PATH}`;

// App configuration
const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Book Manager';
const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE || 'Organize and track your personal book collection';

export default function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'},
    })
      .then(res => res.json())
      .then(setBooks)
      .catch(console.error);
  }, []);

  const addBook = (book) => {
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
      .then(() => fetch(apiUrl))
      .then(res => res.json())
      .then(setBooks)
      .catch(console.error);
  };

  const deleteBook = (id) => {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(() => fetch(apiUrl))
      .then(res => res.json())
      .then(setBooks)
      .catch(console.error);
  };

  // Calculate statistics
  const bookList = books?.books || [];
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