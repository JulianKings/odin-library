// declarations
const bookList = [];
const bookListBox = document.querySelector(".book-list");
const newBookButton = document.querySelector(".header-button button");
const newBookDialog = document.querySelector("#newBookDialog");
const newBookForm = document.querySelector(".new-book-form");
const newBookInputs = document.querySelectorAll(".new-book-form .form-input input");
const newBookCheckbox = document.querySelector(".new-book-form-read-checkbox");
const newBookSubmit = document.querySelector(".new-book-form .form-button button");
const newBookFormElement = document.querySelector(".new-book-form form");
const newBookErrors = document.querySelectorAll(".form-error");

// event handlers
// input animation
newBookInputs.forEach((input) => {
    input.addEventListener("focus", (event) => {
        inputGetsFocus(event);
    });

    input.addEventListener("focusout", (event) => {
        inputLosesFocus(event);
    });
});

// modal animation/handlers
newBookButton.addEventListener("click", (event) => {
    if(newBookDialog.classList.contains("hide"))
    {
        newBookDialog.classList.remove("hide");
        newBookDialog.ontransitionend = undefined;
    }
    newBookDialog.showModal();
    newBookDialog.classList.add("open");
});

newBookDialog.addEventListener("click", (event) => {
    if(newBookDialog.classList.contains("open"))
    {
        newBookDialog.classList.remove("open");
    }
    newBookDialog.classList.add("hide");
    newBookDialog.ontransitionend = (event) => { newBookDialog.close(); };
});

newBookForm.addEventListener("click", (event) => {
    event.stopPropagation();
});

// checkbox handler
newBookCheckbox.addEventListener("click", (event) => {
    let checkBox = event.target;
    if(checkBox.textContent === "✔")
    {
        checkBox.textContent = "";
        checkBox.style["background-color"] = "#e5e7eb";
        if(!checkBox.classList.contains("hov"))
        {
            checkBox.classList.add("hov");
        }
    } else {
        checkBox.textContent = "✔";
        checkBox.style["background-color"] = "#132544";
        if(checkBox.classList.contains("hov"))
        {
            checkBox.classList.remove("hov");
        }
    }

});

newBookCheckbox.addEventListener("mouseover", (event) => {
    let checkBox = event.target;
    if(checkBox.classList.contains("hov"))
    {
        checkBox.style["background-color"] = "#c7c8c9";
    }
});

newBookCheckbox.addEventListener("mouseout", (event) => {
    let checkBox = event.target;
    if(checkBox.classList.contains("hov"))
    {
        checkBox.style["background-color"] = "#e5e7eb";
    }
});


// form actions
newBookFormElement.addEventListener('keydown', (event) => {
    if(event.code === "Enter")
    {
        event.preventDefault();
    }
});

newBookSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    // cleanup errors
    newBookErrors.forEach((error) => {
        error.textContent = "";

        if(error.id === "formTitleError")
        {
            document.getElementById("bookTitle").style['border-color'] = "#132544";
        } else if(error.id === "formAuthorError")
        {
            document.getElementById("bookAuthor").style['border-color'] = "#132544";
        } else if(error.id === "formPagesError")
        {
            document.getElementById("bookPages").style['border-color'] = "#132544";
        }
    })

    // check each input
    let bookTitle = null, bookAuthor = null, bookPages = null;
    newBookInputs.forEach((input) => {
        if(input.id === "bookTitle")
        {
            if(input.value.length === 0)
            {
                input.style["border-color"] = "#500000";
                document.getElementById("formTitleError").textContent = "Please fill in the book's title.";
            } else if(input.value.length > 32)
            {
                input.style["border-color"] = "#500000";
                document.getElementById("formTitleError").textContent = "The title is too long.";
            } else {
                bookTitle = input.value;
            }
        } else if(input.id === "bookAuthor")
        {
            if(input.value.length === 0)
            {
                input.style["border-color"] = "#500000";
                document.getElementById("formAuthorError").textContent = "Please fill in the book's author.";
            } else if(input.value.length > 32)
            {
                input.style["border-color"] = "#500000";
                document.getElementById("formAuthorError").textContent = "The author's name is too long.";
            } else {
                bookAuthor = input.value;
            }
        } else if(input.id === "bookPages")
        {
            if(input.value.length === 0)
            {
                input.style["border-color"] = "#500000";
                document.getElementById("formPagesError").textContent = "Please fill in the number of pages.";
            } else if(input.value == 0 || input.value > 10000)
            {
                input.style["border-color"] = "#500000";
                document.getElementById("formPagesError").textContent = "The number of pages is invalid.";
            } else {
                bookPages = input.value;
            }
        }

        if(bookTitle !== null && bookAuthor !== null && bookPages !== null)
        {
            let bookRead = (newBookCheckbox.textContent !== "");
            appendBookToLibrary(new Book(bookTitle, bookAuthor, bookPages, bookRead));

            cleanupForm();

            if(newBookDialog.classList.contains("open"))
            {
                newBookDialog.classList.remove("open");
            }
            newBookDialog.classList.add("hide");
            newBookDialog.ontransitionend = (event) => { newBookDialog.close(); };
        }
    });
});


// classes
class Book {
    constructor(title, author, pages, read)
    {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }


    info() {
        let writeRead = (this.read) ? 'read' : 'not read yet';
        return `${this.title} by ${this.author}, ${this.pages} pages, ${writeRead}`;
    }

    alternateRead() {
        this.read = !this.read;
    }
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
            targetButton.textContent = "Have to read";
        } else {
            targetButton.classList.add("book-read");
            targetButton.classList.remove("book-not-read");
            targetButton.textContent = "Read";
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

// cleanup helper functions
function cleanupForm()
{
    newBookCheckbox.textContent = "";
    newBookCheckbox.style["background-color"] = "#e5e7eb";
    if(!newBookCheckbox.classList.contains("hov"))
    {
        newBookCheckbox.classList.add("hov");
    }

    newBookInputs.forEach((input) => {
        input.value = "";
    });
}

// async helper functions
async function inputGetsFocus(event)
{
    let currentInput = event.target;
    let currentLabel = event.target.parentElement.firstElementChild;

    currentInput.setAttribute("placeholder", "");
    currentLabel.style["display"] = "block";
    await new Promise(resolve => setTimeout(resolve, 300));
    currentInput.style["padding-top"] = "1rem";
    currentLabel.style["top"] = "-0.3rem";
}

async function inputLosesFocus(event)
{
    let currentInput = event.target;
    let currentLabel = event.target.parentElement.firstElementChild;
    let placeholder = "Name";
    if(currentInput.id === "bookAuthor")
    {
        placeholder = "Author";
    } else if(currentInput.id === "bookPages")
    {
        placeholder = "Pages";
    }

    currentLabel.style["top"] = "1rem";
    currentInput.style["padding-top"] = "0.6rem";
    await new Promise(resolve => setTimeout(resolve, 500));
    currentLabel.style["display"] = "none";
    currentInput.setAttribute("placeholder", placeholder);

}

// Get them from storage

// dom actions
bookList.forEach(appendBook);