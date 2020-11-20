const express = require("express");
const UserController = require("./user.controller");

const router = express.Router();

router.post(
  "/auth/register",
  UserController.validateCreateUser,
  UserController.createUser
);

router.post("/auth/login", UserController.validateLogin, UserController.login);

router.get(
  "/users/current",
  UserController.authorize,
  UserController.getCurrentUser
);

router.post("/auth/logout", UserController.authorize, UserController.logout);

module.exports = router;
