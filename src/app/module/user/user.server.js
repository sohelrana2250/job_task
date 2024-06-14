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
const findAllUser = async () => {
  const result = await Users.find({});
  return result;
};

const ChnageUserStatus = async (id, payload) => {
  const result = await Users.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        role: payload.role,
      },
    },
    { new: true }
  );
  return result;
};

const createAdmin = async (email) => {
  const admin = await Users.findOne({ email }, { role: 1 });
  return admin;
};

module.exports = {
  createUserIntoDb,
  findUser,
  findAllUser,
  ChnageUserStatus,
  createAdmin,
};
