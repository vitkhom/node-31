const Joi = require("joi");
const contactModel = require("./Contact");
const {
  Types: { ObjectId },
} = require("mongoose");

async function listContacts(req, res) {
  const contacts = await contactModel.find();
  res.status(200).json(contacts);
}

function validateId(req, res, next) {
  const {
    params: { id },
  } = req;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ message: "ID is not valid" });
  }

  next();
}

async function getById(req, res) {
  const {
    params: { id },
  } = req;

  const contact = await contactModel.findById(id);

  if (!contact) {
    res.status(404).json({ message: "Contact is not found" });
  }

  res.status(200).json(contact);
}

function validateCreateContact(req, res, next) {
  const validationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    subscription: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string(),
  });

  const validationResult = validationSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({ message: "Missing required field" });
  }

  next();
}

async function addContact(req, res) {
  const contact = await contactModel.create(req.body);

  res.status(201).json(contact);
}

function validateUpdateContact(req, res, next) {
  const validationSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    subscription: Joi.string(),
    password: Joi.string(),
    token: Joi.string(),
  });

  const validationResult = validationSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

async function updateContact(req, res) {
  const {
    params: { id },
  } = req;

  const contact = await contactModel.findByIdAndUpdate(id, {
    $set: req.body,
  });

  if (!contact) {
    res.status(404).json({ message: "Contact is not found" });
  }

  res.json({ message: "Contact is updated" });
}

async function deleteContact(req, res) {
  const {
    params: { id },
  } = req;

  const contact = await contactModel.findByIdAndDelete(id);

  if (!contact) {
    res.status(404).json({ message: "Contact is not found" });
  }

  res.status(200).json({ message: "Contact is deleted" });
}

module.exports = {
  listContacts,
  validateId,
  getById,
  validateCreateContact,
  addContact,
  validateUpdateContact,
  updateContact,
  deleteContact,
};
