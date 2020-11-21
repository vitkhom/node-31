const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
mongoose.set("useFindAndModify", false);

// const contactsRouter = require("./contacts/contact.router");
const userRouter = require("./user/user.router");

let app;

const PORT = process.env.PORT || 8000;

start();

async function start() {
  initExpress();
  initMiddlewares();
  await connectDb();
  initRouts();
  listen();
}

function initExpress() {
  app = express();
}

function initMiddlewares() {
  app.use(cors());
  app.use(express.json());
}

async function connectDb() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function initRouts() {
  app.use("/", userRouter);
  // app.use("/api/contacts", contactsRouter);
}

function listen() {
  app.listen(PORT, () => {
    console.log(`Server is started at ${PORT}`);
  });
}
