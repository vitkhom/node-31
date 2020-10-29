const express = require("express");
const ContactsController = require("../controllers/contacts.controller");

const router = express.Router();

router.get("/", ContactsController.listContacts);
router.get("/:id", ContactsController.getById);
router.post("/", ContactsController.addContact);
router.delete("/:id", ContactsController.deleteContact);
router.patch("/:id", ContactsController.updateContact);

module.exports = router;
