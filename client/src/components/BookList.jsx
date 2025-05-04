export default function BookList({ books, onDelete }) {

    if (!books || !books.books || books.books.length === 0 || books.books === '[]'){
      return <p>No books available.</p>;
    }

    return (
      <ul style={{ listStyle: 'none', margin: 5}}>
        {books.books.map((book) => ((!book) ? <></> :
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
            <button onClick={() => onDelete(book.id)} style={{margin: 5}}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  }