import { useState } from 'react';

export default function BookForm({ onAdd }) {
  const [book, setBook] = useState({ title: '', author: '' });

  const handleChange = (e) =>
  {
    const { name, value } = e.target;

    const newBook = {
      title:  book.title,
      author: book.author
    };

    if (name === 'title') {
      newBook.title = value;
    } else if (name === 'author') {
      newBook.author = value;
    }

    setBook(newBook);
  }
    

  const handleSubmit = () => {
    if (!book.title || !book.author)
    { 
        return;
    }
    
    onAdd(book);
    setBook({ title: '', author: '' });
  };

  return (
    <ul style={{ listStyle: 'none', margin: 5}}>
      <input
        name="title"
        value={book.title}
        onChange={handleChange}
        placeholder="Title"
        style={{ marginRight: '0.5rem' }}
      />
      <input
        name="author"
        value={book.author}
        onChange={handleChange}
        placeholder="Author"
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={handleSubmit} type="submit">Add</button>
      </ul>
  );
}
