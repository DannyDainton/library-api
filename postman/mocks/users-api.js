const http = require("http");

const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url, `http://localhost`);
  const pathname = parsedUrl.pathname;

  const usersMatch = pathname.match(/^\/users\/(\d+)$/);
  const isUsersRoot = pathname === "/users";
  const passwordMatch = pathname.match(/^\/users\/(\d+)\/password$/);

  // @endpoint GET /users
  if (method === "GET" && isUsersRoot) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ users }));
    return;
  }

  // @endpoint GET /users/:userId
  if (method === "GET" && usersMatch) {
    const userId = parseInt(usersMatch[1], 10);
    const user = users.find((u) => u.id === userId);
    if (user) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ user }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found", userId }));
    }
    return;
  }

  // @endpoint POST /users
  if (method === "POST" && isUsersRoot) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const newUser = {
          id: users.length + 1,
          name: parsed.name || "New User",
          email: parsed.email || "new.user@example.com"
        };
        users.push(newUser);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User created successfully", user: newUser }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
    return;
  }

  // @endpoint PUT /users/:userId
  if (method === "PUT" && usersMatch) {
    const userId = parseInt(usersMatch[1], 10);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const user = users.find((u) => u.id === userId);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found", userId }));
        return;
      }
      try {
        const parsed = JSON.parse(body);
        if (parsed.name) user.name = parsed.name;
        if (parsed.email) user.email = parsed.email;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User updated successfully", user }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
    return;
  }

  // @endpoint DELETE /users/:userId
  if (method === "DELETE" && usersMatch) {
    const userId = parseInt(usersMatch[1], 10);
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found", userId }));
      return;
    }
    const deleted = users.splice(index, 1)[0];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User deleted successfully", user: deleted }));
    return;
  }

  // @endpoint PATCH /users/:userId/password
  if (method === "PATCH" && passwordMatch) {
    const userId = parseInt(passwordMatch[1], 10);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const user = users.find((u) => u.id === userId);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found", userId }));
        return;
      }
      try {
        const parsed = JSON.parse(body);
        if (!parsed.currentPassword || !parsed.newPassword) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "currentPassword and newPassword are required" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Password changed successfully" }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
    return;
  }

  // Fallback for unmocked routes
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Mock route not defined", method, url }));
});

const PORT = process.env.PORT || 4500;
server.listen(PORT);
