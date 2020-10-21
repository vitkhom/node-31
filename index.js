const express = require("express");
const cors = require("cors");
const usersRouter = require("./routers/users.router");

const PORT = process.env.PORT || 8080;

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRouters();
    this.listen();
  }

  initMiddlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  initRouters() {
    this.server.use("/api/contacts", usersRouter);
  }

  listen() {
    this.server.listen(PORT, () => {
      console.log(`Server is started at ${PORT}`);
    });
  }
}

const server = new Server();
server.start();
