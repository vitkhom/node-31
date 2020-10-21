const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join("db", "contacts.json");
const fsPromise = fs.promises;

function listContacts() {
  fsPromise
    .readFile(contactsPath)
    .then((res) => console.table(JSON.parse(res)))
    .catch((err) => console.error(err));
}

function getContactById(contactId) {
  fsPromise
    .readFile(contactsPath)
    .then((res) => JSON.parse(res))
    .then((res) => {
      const contact = res.find(({ id }) => id === contactId);
      console.table(contact);
    })
    .catch((err) => console.error(err));
}

function removeContact(contactId) {
  fsPromise
    .readFile(contactsPath)
    .then((res) => JSON.parse(res))
    .then((res) => {
      const filteredContacts = res.filter(({ id }) => id !== contactId);
      fsPromise.writeFile(contactsPath, JSON.stringify(filteredContacts));
      console.log("Contact is removed");
    })
    .catch((err) => console.error(err));
}

function addContact(name, email, phone) {
  const id = uuidv4();
  const addedContact = { id, name, email, phone };

  fsPromise
    .readFile(contactsPath)
    .then((res) => JSON.parse(res))
    .then((res) => {
      const newContacts = [...res, addedContact];
      fsPromise.writeFile(contactsPath, JSON.stringify(newContacts));
      console.log("Contact is added");
    });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
