const http = require("http");
const PORT = process.env.PORT || 4500;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // @endpoint GET /books
  if (method === "GET" && url === "/books") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify([
      { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", publishedYear: 1925 },
      { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061935466", publishedYear: 1960 },
      { id: 3, title: "1984", author: "George Orwell", isbn: "9780451524935", publishedYear: 1949 }
    ]));
  }

  // @endpoint GET /books/:id
  if (method === "GET" && /^\/books\/\d+$/.test(url)) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(
      { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", publishedYear: 1925 }
    ));
  }

  // @endpoint POST /books
  if (method === "POST" && url === "/books") {
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
  if (method === "PUT" && /^\/books\/\d+$/.test(url)) {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const id = parseInt(url.split("/")[2]);
      res.writeHead(200, { "Content-Type": "application/json" });
      const book = Object.assign({ id }, JSON.parse(body || "{}"));
      res.end(JSON.stringify(book));
    });
    return;
  }

  // @endpoint DELETE /books/:id
  if (method === "DELETE" && /^\/books\/\d+$/.test(url)) {
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