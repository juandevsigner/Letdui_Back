import User from "../models/User.js";
import genToken from "../helpers/genToken.js";
import createJWT from "../helpers/createJWT.js";

const createUsers = async (req, res) => {
  const { email } = req.body;
  const mailExists = await User.findOne({ email });
  if (mailExists) {
    return res.status(400).json({
      msg: "the email is registered",
    });
  }
  try {
    const user = new User(req.body);
    user.token = genToken();
    const userSave = await user.save();
    res.json({
      msg: "The user has been created!",
      userSave,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUsers = (req, res) => {
  res.json({
    msg: "delete pay",
  });
};

const auth = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(`${email} does not registered`);
    return res.status(400).json({
      msg: error.message,
    });
  }

  if (!user.confirmed) {
    const error = new Error(`${email} does not confirmed`);
    return res.status(400).json({
      msg: error.message,
    });
  }

  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: createJWT(user._id),
    });
  } else {
    const error = new Error(`password incorrect`);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });
  if (!userConfirm) {
    const error = new Error(`token invalid`);
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    userConfirm.confirmed = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.status(200).json({
      msg: "User confirmed successfully!",
    });
  } catch (error) {
    console.log(error);
  }
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      msg: "the email does not registered",
    });
  }

  try {
    user.token = genToken();
    await user.save();
    res.status(200).json({ msg: "We send you an email with the instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  const tokenValid = await User.findOne({ token });
  if (tokenValid) {
    res.json({ msg: "Correct Token!!" });
  } else {
    const error = new Error("Invalid Token");
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";
    try {
      await user.save();
      res
        .status(200)
        .json({ msg: "A new password has been created successfully" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Invalid Token");
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  deleteUsers,
  auth,
  confirm,
  recoverPassword,
  checkToken,
  newPassword,
  createUsers,
  profile,
};
