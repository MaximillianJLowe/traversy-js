class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
  // Create tr element
  const row = document.createElement('tr');
  // Insert Columns (mind the backticks)
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X<a></td>
    `;

  list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add classes (mind the backticks)
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get Parent
    const container = document.querySelector('.container');
    // Get Form
    const form = document.querySelector('#book-form');
    // Insert Alert
    container.insertBefore(div, form);
    // Timout after 3 sec
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove(); //gets us to tr element for removal
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    // to show deletion is linked to isbn "DOM magic" console.log(isbn);
    const books = Store.getBooks();

    books.forEach(function(book, index){
      if(book.isbn === isbn) {
        books.splice(index, 1);
      } 
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}


// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);
// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
  // Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value
  
  // Instantiate book    
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // to see that everything under the hood is the same as ES5 and that ES6 is just syntactical sugar  console.log(ui);  then see all the same methods within the __proto__: object

  // Validate
  if(title === '' || author === '' || isbn === '') {
    // Error Alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to LS
    Store.addBook(book);

    // Show Success
    ui.showAlert('Book Added!', 'success');
  
  // Clear Fields
  ui.clearFields();
  }


  e.preventDefault();
});

//Testing Github VSC

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function(e){
  
  // Instantiate UI
  const ui = new UI();

  // Delete book
  ui.deleteBook(e.target);

  // Remove from LS - We use ISBN to work some "DOM magic" to target the td contents
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
})