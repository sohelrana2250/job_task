const Users = require("./user.model");

const createUserIntoDb = async (payload) => {
  const postUser = new Users(payload);
  const result = await postUser.save();
  return result;
};

const findUser = async (email) => {
  const result = await Users.findOne({ email });
  return result;
};

module.exports = {
  createUserIntoDb,
  findUser,
};
