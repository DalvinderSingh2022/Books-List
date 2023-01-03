class book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class ui {
    static displayBooks() {
        const books = store.getBooks();
        books.forEach((book) => ui.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td ><button class="btn btn-danger btn-sm delete" ><i class="fas fa-trash"></i></button></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlerts(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} mt-5`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBooks(book) {
        const books = store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', ui.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e) => {

    e.preventDefault();
    
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') {
        ui.showAlerts('Please fill in the fields', 'danger');
    }else{
        const Book = new book(title, author, isbn);
        ui.showAlerts('Book Added', 'success');
        ui.addBookToList(Book);
        store.addBooks(Book);
        ui.clearFields();
    }
});

document.querySelector("#book-list").addEventListener('click', (e) => {
    ui.deleteBook(e.target);
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    ui.showAlerts('Book Removed', 'success');
})