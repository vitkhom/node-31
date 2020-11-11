const Joi = require("joi");
const fs = require("fs");
const path = require("path");

const db = require("../db/contacts.json");
const contactsPath = path.join("db", "contacts.json");

const fsPromise = fs.promises;

module.exports = class ContactController {
  static listContacts(req, res) {
    res.status(200).json(db);
  }

  static getById(req, res) {
    const { id } = req.params;
    const contactId = +id;
    const contact = db.find(({ id }) => id === contactId);

    if (!contact) {
      res.status(404).json({ message: "Contact is not found" });
    }

    res.status(200).json(contact);
  }

  static addContact(req, res) {
    const validationParams = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = validationParams.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const createdContact = {
      id: db.length + 1,
      ...req.body,
    };

    const newContacts = [...db, createdContact];

    fsPromise.writeFile(contactsPath, JSON.stringify(newContacts));

    res.status(201).json(createdContact);
  }

  static deleteContact(req, res) {
    const { id } = req.params;
    const contactId = +id;
    const contactIndex = db.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
      res.status(404).json({ message: "Contact is not found" });
    }

    const filteredContacts = db.filter(({ id }) => id !== contactId);

    fsPromise.writeFile(contactsPath, JSON.stringify(filteredContacts));

    res.status(200).json({ message: "Contact deleted" });
  }

  static updateContact(req, res) {
    const { id } = req.params;
    const contactId = +id;
    const contactIndex = db.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
      res.status(404).json({ message: "Contact is not found" });
    }

    const updatedContact = {
      ...db[contactIndex],
      ...req.body,
    };

    db[contactIndex] = updatedContact;
    fsPromise.writeFile(contactsPath, JSON.stringify(db));

    res.status(201).json(updatedContact);
  }
};
