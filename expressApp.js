
import express from "express";

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Books Array
let books = [
    { id: 101, title: "The Alchemist", author: "Paulo Coelho", price: 3500 },
    { id: 102, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 2500 },
    { id: 103, title: "Pride and Prejudice", author: "Jane Austen", price: 2000 },
    { id: 104, title: "Hamlet", author: "William Shakespeare", price: 2003 }
];

// 1. GET - Display all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// 2. GET - Display book by ID
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 3. POST - Add a new book
app.post("/books", (req, res) => {
    const { id, title, author, price } = req.body;

    if (!id || !title || !author || price === undefined) {
        return res.status(400).json({
            message: "Please provide all book details"
        });
    }

    const exists = books.find(b => b.id === Number(id));

    if (exists) {
        return res.status(409).json({
            message: "Book ID already exists"
        });
    }

    const newBook = {
        id: Number(id),
        title,
        author,
        price: Number(price)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// 4. PUT - Update a book by ID
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (price !== undefined) book.price = Number(price);

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});

// 5. DELETE - Delete a book by ID
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});
