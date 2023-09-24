// declarations
const bookList = [];
const bookListBox = document.querySelector(".book-list");

// constructors
function Book(title, author, pages, read)
{
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// prototype functions
Book.prototype.info = function() {
        let writeRead = (this.read) ? 'read' : 'not read yet';
        return `${this.title} by ${this.author}, ${this.pages} pages, ${writeRead}`;
    }

Book.prototype.alternateRead = function () {
    this.read = !this.read;
}

// functions
function appendBook(book, index)
{
    const newBook = document.createElement("div");
    newBook.classList.add("book-card");
    newBook.setAttribute("data-book-read", book.read);
    newBook.setAttribute("data-book-index", index);

    // add each part
    const bookTitle = document.createElement("div");
    bookTitle.classList.add("book-title");
    bookTitle.textContent = book.title;
    newBook.appendChild(bookTitle);

    const bookAuthor = document.createElement("div");
    bookAuthor.classList.add("book-author");
    bookAuthor.textContent = "Written by " + book.author;
    newBook.appendChild(bookAuthor);

    const bookPages = document.createElement("div");
    bookPages.classList.add("book-pages");
    bookPages.textContent = `It has ${book.pages} pages`;
    newBook.appendChild(bookPages);

    const bookRead = document.createElement("div");
    bookRead.classList.add((book.read) ? "book-read" : "book-not-read");
    bookRead.textContent = (book.read) ? "Read" : "Have to read";
    // add click handler
    bookRead.addEventListener("click", (event) => {
        let targetButton = event.target;
        let targetBook = bookList[event.target.parentElement.getAttribute("data-book-index")];
        if(targetBook.read)
        {
            targetButton.classList.remove("book-read");
            targetButton.classList.add("book-not-read");
        } else {
            targetButton.classList.add("book-read");
            targetButton.classList.remove("book-not-read");
        }
        targetBook.alternateRead();
        targetButton.parentElement.setAttribute("data-book-read", targetBook.read);
    })
    newBook.appendChild(bookRead);

    const bookRemove = document.createElement("div");
    bookRemove.classList.add("book-remove");
    bookRemove.addEventListener("click", (event) => {
        bookList.splice(event.target.parentElement.getAttribute("data-book-index"), 1);
        bookListBox.removeChild(event.target.parentElement);        
    })
    newBook.appendChild(bookRemove);

    bookListBox.appendChild(newBook);
}

function appendBookToLibrary(book)
{
    appendBook(book, bookList.length);
    bookList.push(book);
}

// Get them from storage
bookList.push(new Book("The Hobbit", "J.R.R Tolkien", 295, false));
bookList.push(new Book("The Hobbit", "J.R.R Tolkien", 295, true));
bookList.push(new Book("The Hobbit", "J.R.R Tolkien", 295, false));
bookList.push(new Book("The Hobbit", "J.R.R Tolkien", 295, true));

// dom actions
bookList.forEach(appendBook);