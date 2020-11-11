const express = require("express");
const ContactController = require("./contact.controller");

const router = express.Router();

router.get("/", ContactController.listContacts);

router.post(
  "/",
  ContactController.validateCreateContact,
  ContactController.addContact
);

router.get("/:id", ContactController.validateId, ContactController.getById);

router.patch(
  "/:id",
  ContactController.validateUpdateContact,
  ContactController.validateId,
  ContactController.updateContact
);

router.delete(
  "/:id",
  ContactController.validateId,
  ContactController.deleteContact
);

module.exports = router;
