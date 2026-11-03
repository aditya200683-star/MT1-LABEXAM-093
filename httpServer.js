import http from 'http';
import fs from 'fs';

let books = [
    {
        id: 101,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 3500
    },
    {
        id: 102,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 2500
    },
    {
        id: 103,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 2000
    },
    {
        id: 104,
        title: "Hamlet",
        author: "William Shakespeare",
        price: 2003
    }
];

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Library Management System</h1>");
    }
    else if (req.url === "/books" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(books));
    }
    else if (req.url === "/about" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Library Management Application</h1>");
    }
    else if (req.url === "/home" && req.method === "GET") {

        fs.readFile("./public/index.html", "utf8", (err, data) => {

            if (err) {

                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error reading HTML file");
            }

            else {

                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);
            }
        });
    }
    else if (req.url === "/add-book" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {

                let book = JSON.parse(body);

                if (
                    book.id === undefined ||
                    !book.title ||
                    !book.author ||
                    book.price === undefined ||
                    !Number.isFinite(Number(book.id)) ||
                    !Number.isFinite(Number(book.price))
                ) {

                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Invalid book details"
                    }));

                    return;
                }

                if (books.some(b => b.id == book.id)) {

                    res.writeHead(409, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Book ID already exists"
                    }));

                    return;
                }

                books.push(book);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Book added successfully",
                    book: book
                }));

            }

            catch (err) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }
    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

server.listen(3000, () => {

    console.log("HTTP Server running at http://localhost:3000");

});