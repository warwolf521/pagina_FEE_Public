import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 8080;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Initialize the global users array
let users = [];


app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res);
  });

  // Create WebSocket server using Socket.io
  const io = new Server(httpServer);

  // Middleware to check for username before allowing connection
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

  // Handle WebSocket connections
  io.on("connection", (socket) => {

    // Add the new user to the users array
    users.push({
      socketID: socket.id,
      username: socket.username,
    });

    // Emit the updated list of users to all connected clients
    io.emit("users", users);

    socket.emit("users", users);


    // Handle private messages
    socket.on("private message", ({ content, to }) => {

      socket.to(to).emit("private message", {
        content,
        username: socket.username,
        from: socket.id,
      });
    });


    socket.on("disconnect", () => {

      // Remove the user from the users array
      users = users.filter(user => user.socketID !== socket.id);

      // Emit the updated list of users to all connected clients
      io.emit("users", users);

    });
  });

  // Start the server
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
