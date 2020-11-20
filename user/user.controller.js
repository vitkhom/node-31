const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./User");

async function createUser(req, res) {
  const {
    body: { password, email },
  } = req;

  const hashedPassword = await bcryptjs.hash(password, 10);

  const emailVerification = await userModel.findOne({
    email,
  });

  if (emailVerification) {
    res.status(409).json({ message: "Email already used" });
  }

  const user = await userModel.create({
    ...req.body,
    password: hashedPassword,
  });

  const { subscription } = user;

  res.status(201).json({ user: { email, subscription } });
}

function validateCreateUser(req, res, next) {
  const validationSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = validationSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

async function login(req, res) {
  const {
    body: { email, password },
  } = req;

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    res.status(401).json({ message: "Email or password is wrong" });
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "Email or password is wrong" });
  }

  const token = await jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );

  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = payload;

  const newUser = await userModel.findOneAndUpdate(userId, {
    $set: { token },
  });

  const { subscription } = newUser;

  res.status(200).json({
    token,
    user: { email, subscription },
  });
}

function validateLogin(req, res, next) {
  const validationSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = validationSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

async function authorize(req, res, next) {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).userId;
    } catch (err) {
      next(new UnauthorizedError("User not authorized"));
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedError();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res) {
  const token = req.token;

  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = payload;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(401).json({ message: "Authorization is failed" });
  }

  const { email, subscription } = user;

  res.status(200).json({ email, subscription });
}

async function logout(req, res) {
  const token = req.token;

  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = payload;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(401).json({ message: "Authorization is failed" });
  }

  const logedOutUser = await userModel.findByIdAndUpdate(userId, {
    $unset: { token },
  });

  const { email } = logedOutUser;

  res.status(200).json({ message: `User ${email} is logged out` });
}

module.exports = {
  createUser,
  validateCreateUser,
  login,
  validateLogin,
  authorize,
  getCurrentUser,
  logout,
};
