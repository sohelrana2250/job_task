const Events = require("../event/event.model");
const Users = require("../user/user.model");
const Books = require("./book.model");

const bookingEventIntoDb = async (payload) => {
  // isExist Event
  const isExistEvent = await Events.findOne(
    { _id: payload.eventId },
    { _id: 1, price: 1 }
  );
  if (!isExistEvent) {
    return "This Event Not Exist in the Database";
  }
  const createEvent = new Books({ ...payload, price: isExistEvent.price });
  const result = await createEvent.save();
  return result;
};
const mybookingIntoDb = async (email) => {
  const result = await Books.find({ email });
  return result;
};

const deleteMyBooking = async (id, email) => {
  const isExistUser = await Users.findOne({ email }, { _id: 1 });
  if (!isExistUser) {
    return "This User Not Exist in the Database";
  }
  const isExistMyBooking = await Books.findById(id);
  if (!isExistMyBooking) {
    return "This Booking Can Not Be Deleted";
  }
  if (isExistMyBooking.paymentstatus) {
    return "payable Booking Can Not be Deleted";
  }
  if (!isExistMyBooking.paymentstatus) {
    const result = await Books.deleteOne({ _id: id });
    return result;
  }
  return "Something went Wrong";
};

module.exports = {
  bookingEventIntoDb,
  mybookingIntoDb,
  deleteMyBooking,
};
