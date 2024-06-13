const Users = require("../user/user.model");
const Events = require("./event.model");

const createEventIntoDb = async (payload) => {
  // is it Admin
  const isAdmin = await Users.findOne(
    { email: payload.createdAtBy },
    { role: 1 }
  );
  if (isAdmin.role !== "admin") {
    return "Only Admin can be Create Event";
  }
  const createEvent = new Events(payload);
  const result = await createEvent.save();
  return result;
};
const findSpecificEventIntoDb = async (id) => {
  const result = await Events.findById(id);
  return result;
};
const findAllEventIntoDb = async () => {
  const result = await Events.find();
  return result;
};
const updateEvenetFromDb = async (id, payload) => {
  // validation
  const isExistEvent = await Events.findById(id);
  if (!isExistEvent) {
    return "This event Not Exist in the Database";
  }
  const isExistUser = await Users.findOne(
    { email: payload.createdAtBy },
    { _id: 1 }
  );
  if (!isExistUser) {
    return "This User Not Exist in the Database";
  }
  const result = await Events.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const deleteEvenetFromDb = async (id, email) => {
  const isExistUser = await Users.findOne({ email: email }, { role: 1 });
  if (!isExistUser.role !== "admin") {
    return "Only Admin Can be deleted this Event";
  }

  const result = await Events.deleteOne({ _id: id });
  return result;
};

module.exports = {
  createEventIntoDb,
  findSpecificEventIntoDb,
  updateEvenetFromDb,
  deleteEvenetFromDb,
  findAllEventIntoDb,
};
