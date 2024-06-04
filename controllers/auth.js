const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

const register = async (req, res) => {
  // ? We don't need to validate form because MongoDB Schema do it for us
  // const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   throw new BadRequestError('Please provide name, email and password');
  // }

  // ? I refactor this code and use it in User.js model
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // const temporaryUser = {
  //   name,
  //   email,
  //   password: hashedPassword,
  // };

  const user = await User.create({ ...req.body });

  // ? Logic have beed moved to User.js model
  // const token = jwt.sign({ userId: user._id, name: user.name }, 'jwtSecret', {
  //   expiresIn: '30d',
  // });

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token: user.createJWT() });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid password');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
