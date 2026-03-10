const http = require("http");
const PORT = process.env.PORT || 4500;

const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", publishedYear: 1925 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061935466", publishedYear: 1960 },
  { id: 3, title: "1984", author: "George Orwell", isbn: "9780451524935", publishedYear: 1949 }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // @endpoint GET /books
  if (method === "GET" && pathname === "/books" && !parsedUrl.search) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(books));
  }

  // @endpoint GET /books/search
  if (method === "GET" && pathname === "/books/search") {
    const query = (parsedUrl.searchParams.get("q") || "").toLowerCase();
    const results = books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(results));
  }

  // @endpoint GET /books/:id
  if (method === "GET" && /^\/books\/\d+$/.test(pathname)) {
    const id = parseInt(pathname.split("/")[2]);
    const book = books.find(b => b.id === id) || books[0];
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(book));
  }

  // @endpoint POST /books
  if (method === "POST" && pathname === "/books") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      res.writeHead(201, { "Content-Type": "application/json" });
      const book = Object.assign({ id: 1 }, JSON.parse(body || "{}"));
      res.end(JSON.stringify(book));
    });
    return;
  }

  // @endpoint PUT /books/:id
  if (method === "PUT" && /^\/books\/\d+$/.test(pathname)) {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const id = parseInt(pathname.split("/")[2]);
      res.writeHead(200, { "Content-Type": "application/json" });
      const book = Object.assign({ id }, JSON.parse(body || "{}"));
      res.end(JSON.stringify(book));
    });
    return;
  }

  // @endpoint DELETE /books/:id
  if (method === "DELETE" && /^\/books\/\d+$/.test(pathname)) {
    res.writeHead(204);
    return res.end();
  }

  // Fallback: unknown route
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Mock route not defined", method, url }));
});

server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});