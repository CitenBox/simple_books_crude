// File: src/App.jsx
import { useState, useEffect } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

const apiUrl = 'http://localhost:3001/books';

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

  return (
    <div>
      <h1>Book Manager</h1>
      <BookForm onAdd={addBook} />
      <BookList books={books} onDelete={deleteBook} />
    </div>
  );
}