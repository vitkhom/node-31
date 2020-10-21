module.exports = class NotFoundError extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    delete this.stack;
    this.message = "User is not found";
  }
};
