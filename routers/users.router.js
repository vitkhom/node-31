const express = require("express");
const UsersController = require("../controllers/users.controller");

const router = express.Router();

router.get("/", UsersController.listContacts);
router.get("/:id", UsersController.getById);
router.post("/", UsersController.addContact);
router.delete("/:id", UsersController.deleteContact);
router.patch("/:id", UsersController.updateContact);

module.exports = router;
